const mongoose = require('mongoose');
const groupSchema = new mongoose.Schema(
    {
        id: {
            type: mongoose.Schema.Types.UUID
        },
        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
        },
        members: [{ type: mongoose.Schema.Types.UUID }],
        admins: [{ type: mongoose.Schema.Types.UUID }],
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