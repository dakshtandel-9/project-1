const Joi = require('joi');

const defaultImageUrl = "https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630";

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        country: Joi.string().required(),
        image: Joi.object({
            url: Joi.string().allow('', null).default(defaultImageUrl)
        })
    }).required()
});

const reviewSchema = Joi.object({
    review: Joi.object({
        rating:Joi.number().min(1).max(5).required(),
        comment:Joi.string().required(),
    }).required(),
})

module.exports = {
    listingSchema,reviewSchema
};
