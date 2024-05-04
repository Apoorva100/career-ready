// // let id: String
// //     let title: String
// //     let date: EventDate?
// //     let address: [String]
// //     let link: String
// //     let description: String
// //     let thumbnail: String?

// import { Prop, Schema } from "@nestjs/mongoose";
// import { randomUUID } from "crypto";

// @Schema()
// export class Event{
//     @Prop({type: String, default: () => randomUUID()})
//     id: string;
//     @Prop({type: String, default:''})
//     // title: String;x/
//     @Prop({type: [String], default:[]})
//     address: Array<String>;
//     @Prop({type: String, default:''})
//     link: String;
//     @Prop({type: String, default:''})
//     description: String;
//     @Prop({type: String, default: ''})
//     thumbnail: String;
// }

// @Schema({ _id: false, versionKey: false })
// export class Education {
//   @Prop({ type: String, default: '' })
//   degree: string;
//   @Prop({ type: String, default: '' })
//   university: string;
//   @Prop({ type: String, default: '' })
//   graduationYear: string;
// }

// export type EducationDocument = Education & Document;
// export const EducationSchema = SchemaFactory.createForClass(Education);
