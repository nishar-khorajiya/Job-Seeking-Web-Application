import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import  Job  from "../models/jobSchema.js";
import User from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";

export const getAllJobs = catchAsyncErrors(async (req, res, next) => {
  const jobs = await Job.findAll({ where: { expired: false } });
  res.status(200).json({
    success: true,
    jobs,
  });
});

export const postJob = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === 'Job Seeker') {
    return next(new ErrorHandler('Job Seeker not allowed to access this resource.', 400));
  }

  const {
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
  } = req.body;

  if (!title || !description || !category || !country || !city || !location) {
    return next(new ErrorHandler('Please provide full job details.', 400));
  }

  if ((!salaryFrom || !salaryTo) && !fixedSalary) {
    return next(new ErrorHandler('Please either provide fixed salary or ranged salary.', 400));
  }

  if (salaryFrom && salaryTo && fixedSalary) {
    return next(new ErrorHandler('Cannot enter fixed and ranged salary together.', 400));
  }

  const postedBy = req.user.id;
  const job = await Job.create({
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
    postedBy,
  });

  res.status(200).json({
    success: true,
    message: 'Job posted successfully!',
    job,
  });
});

export const getMyJobs = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === 'Job Seeker') {
    return next(new ErrorHandler('Job Seeker not allowed to access this resource.', 400));
  }

  const myJobs = await Job.findAll({ where: { postedBy: req.user.id } });
  res.status(200).json({
    success: true,
    myJobs,
  });
});

export const updateJob = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === 'Job Seeker') {
    return next(new ErrorHandler('Job Seeker not allowed to access this resource.', 400));
  }

  const { id } = req.params;
  console.log("id is:"+id)
  let job = await Job.findByPk(id);
  if (!job) {
    return next(new ErrorHandler('Job not found.', 404));
  }

  job = await job.update(req.body);

  res.status(200).json({
    success: true,
    message: 'Job updated!',
  });
});

export const deleteJob = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === 'Job Seeker') {
    return next(new ErrorHandler('Job Seeker not allowed to access this resource.', 400));
  }

  const { id } = req.params;
  const job = await Job.findByPk(id);
  if (!job) {
    return next(new ErrorHandler('Job not found.', 404));
  }

  await job.destroy();
  res.status(200).json({
    success: true,
    message: 'Job deleted!',
  });
});

export const getSingleJob = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  try {
    const job = await Job.findByPk(id);
    if (!job) {
      return next(new ErrorHandler('Job not found.', 404));
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    return next(new ErrorHandler('Invalid ID / CastError', 404));
  }
});