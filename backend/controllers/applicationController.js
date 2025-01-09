import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import  Application  from "../models/applicationSchema.js";
import  Job  from "../models/jobSchema.js";
import cloudinary from "cloudinary";

export const postApplication = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Employer") {
    return next(
      new ErrorHandler("Employer not allowed to access this resource.", 400)
    );
  }
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Resume File Required!", 400));
  }

  const { resume } = req.files;
    const cloudinaryResponse = await cloudinary.uploader.upload(
    resume.tempFilePath
  );

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    return next(new ErrorHandler("Failed to upload Resume to Cloudinary", 500));
  }

  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(resume.mimetype)) {
    return next(
      new ErrorHandler("Invalid file type. Please upload a PNG file.", 400)
    );
  }

  const { name, email, coverLetter, phone, address, jobId } = req.body;
  if (!jobId) {
    return next(new ErrorHandler("Job not found!", 404));
  }
  const jobDetails = await Job.findByPk(jobId);
  if (!jobDetails) {
    return next(new ErrorHandler("Job not found!", 404));
  }

  const employerID = jobDetails.postedBy;

  const application = await Application.create({
    name,
    email,
    coverLetter,
    phone:phone.toString(),
    address,
    applicantId:req.user.id,
    employerId:employerID,
    resumePublicId:cloudinaryResponse.public_id,
    resumeUrl:cloudinaryResponse.secure_url
  });
  res.status(200).json({
    success: true,
    message: "Application Submitted!",
    application,
  });
});


export const employerGetAllApplications = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
      return next(
        new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
      );
    }
    const applications = await Application.findAll({
      where: { employerId: req.user.id },
    });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);


export const jobseekerGetAllApplications = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler("Employer not allowed to access this resource.", 400)
      );
    }
   
    const applications = await Application.findAll({
      where: { applicantId: req.user.id },
    });
    
    res.status(200).json({
      success: true,
      applications,
    });
  }
);


export const jobseekerDeleteApplication = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler("Employer not allowed to access this resource.", 400)
      );
    }
    const { id } = req.params;
    const application = await Application.findByPk(id);
    if (!application) {
      return next(new ErrorHandler("Application not found!", 404));
    }
    await application.destroy();
    res.status(200).json({
      success: true,
      message: "Application Deleted!",
    });
  }
);
