import mongoose, { Document, Model, Schema } from 'mongoose';

interface ProjectSchemaType extends Document {
  name: string;
  createdBy: string;
  project_url: string;
  serverDomain: string;
  clientDomain: string;
  serverDockerImage: string;
  env: [
    {
      key: string;
      value: string;
    },
  ];
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
    serverDomain: {
      type: String,
      trim: true,
      default: null,
    },
    clientDomain: {
      type: String,
      trim: true,
      default: null,
    },
    serverDockerImage: {
      type: String,
      trim: true,
      default: null,
    },
    env: {
      type: [
        {
          key: { type: String, trim: true },
          value: { type: String, trim: true },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

export const Project = mongoose.model<ProjectSchemaType>('project', ProjectSchema);
