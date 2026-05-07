import mongoose from 'mongoose';
import { DEFAULT_KADER_NAME_COLOR, KADER_NAME_COLOR_VALUES } from "../constants/kader.constants.js";


const KaderSchema = new mongoose.Schema({
    submainId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubMain',
        required: true
    },
    name: {
        type: String,
        default: '',
        trim: true
    },
    tasks: {
        type: String,
        default: '',
        trim: true
    },
    nameColor: {
        type: String,
        enum: KADER_NAME_COLOR_VALUES,
        default: DEFAULT_KADER_NAME_COLOR,
    },
    
} , {
    timestamps: true,
    collection: 'kader'
});

const Kader = mongoose.model('Kader', KaderSchema);
export default Kader;