import mongoose, { Document, Model, Schema } from "mongoose";

interface ProjectSchemaType extends Document {
  name: string;
  createdBy: string;
  project_url: string;
  domain: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<ProjectSchemaType>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: String,
      required: true,
      trim: true,
    },
    project_url: {
      type: String,
      required: true,
      trim: true,
    },
    domain: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Project = mongoose.model<ProjectSchemaType>(
  "project",
  ProjectSchema
);