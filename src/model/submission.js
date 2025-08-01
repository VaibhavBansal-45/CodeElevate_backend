const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const submissionSchema=new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref:'user',
        required:true,
    },
    problemId:{
        type:Schema.Types.ObjectId,
        ref:'problem',
        required:true,
    },
    code:{
        type: String,
        required:true,
    },
    language:{
        type:String,
        required:true,
        enum:['c++','java','javascript','python']
    },
    status:{
        type:String,
        enum:['pending','accepted','wrong','error'],
        default:'pending'
    },
    runtime:{
        type:Number,
        default:0
    },
    memory:{
        type:Number,
        default:0
    },
    errorMessage:{
        type:String,
        default:""
    },
    testCasePassed:{
        type:String,
        default:0
    },
    testCaseTotal:{
        type:Number,
        default:0
    }
},{
    timestamps:true
});

submissionSchema.index({userId:1, problemId:1});

const submission=mongoose.model('submission', submissionSchema);
module.exports=submission;