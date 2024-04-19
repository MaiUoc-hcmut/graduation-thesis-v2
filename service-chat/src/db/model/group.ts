const mongoose = require('mongoose');
const { v4: uuidv4, validate: uuidValidate } = require('uuid');

const validateUUID = {
    validator: function(v: string) {
        return uuidValidate(v);
    },
    message: "Id must be valid UUID!"
}

const groupSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            default: uuidv4,
            validator: validateUUID
        },
        lastMessage: {
            type: String,
            ref: 'Message',
        },
        members: [{ type: String, validator: validateUUID }],
        admins: [{ type: String, validator: validateUUID }],
        name: {
            type: String,
        },
        individual: {
            type: Boolean,
        }
    }, {
        timestamps: true,
    }
);

groupSchema.virtual('messages', {
    ref: 'Message',
    foreignField: 'id_group',
    localField: 'id'
})

const Group = mongoose.model('Group', groupSchema);
module.exports = Group;