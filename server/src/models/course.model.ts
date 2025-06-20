import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./user.model";

interface IReview extends Document {
  user: IUser;
  rating: number;
  comment: string;
  commentReplies?: IComment[];
}

interface IComment extends Document {
  user: IUser;
  question: string;
  questionReplies: IComment[];
}

interface ILink extends Document {
  title: string;
  url: string;
}

interface ICourseData extends Document {
  title: string;
  description: string;
  videoUrl: string;
  videoThumbnail: object;
  videoSection: string;
  videoLength: number;
  videoPlayerUrl: string;
  links: ILink[];
  suggestions: string[];
  questions: IComment[];
}

interface ICourse extends Document {
  name: string;
  description: string;
  price: number;
  estimatedPrice?: number;
  thumbnail: {
    public_id: string;
    url: string;
  };
  tags: string[];
  level: string;
  demoUrl: string;
  benefits: {
    title: {
      type: String;
      required: true;
    };
  }[];
  prerequisites: {
    title: {
      type: String;
      required: true;
    };
  }[];
  reviews: IReview[];
  courseData: ICourseData[];
  ratings?: number;
  purchased?: number;
}

const reviewSchema = new Schema<IReview>({
  user: Object,
  rating: {
    type: Number,
    default: 0,
  },
  comment: {
    type: String,
  },
  commentReplies: [Object],
});

const linkSchema = new Schema<ILink>({
  title: {
    type: String,
  },
  url: {
    type: String,
  },
});

const commentSchema = new Schema<IComment>({
  user: Object,
  question: String,
  questionReplies: [Object],
});

const courseDataSchema = new Schema<ICourseData>({
  videoUrl: String,
  title: String,
  videoSection: String,
  description: String,
  videoLength: Number,
  videoPlayerUrl: String,
  links: [linkSchema],
  suggestions: [String],
  questions: [commentSchema],
});

const courseSchema = new Schema<ICourse>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    estimatedPrice: {
      type: Number,
    },
    thumbnail: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    tags: {
      type: [String],
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    demoUrl: {
      type: String,
    },
    benefits: [
      {
        title: {
          type: String,
        },
      },
    ],
    prerequisites: [
      {
        title: {
          type: String,
        },
      },
    ],
    reviews: [reviewSchema],
    courseData: [courseDataSchema],
    ratings: {
      type: Number,
      default: 0,
    },
    purchased: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const courseModel = mongoose.model<ICourse>("Course", courseSchema);

export default courseModel;
