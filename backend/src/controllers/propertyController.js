const Property = require('../models/Property');
const { validationResult } = require('express-validator');

exports.createProperty = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const property = new Property(req.body);
    await property.save();

    res.status(201).json({
      message: 'Property created successfully',
      property
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error creating property', 
      error: error.message 
    });
  }
};

exports.getProperties = async (req, res) => {
  try {
    const { type, minPrice, maxPrice } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (minPrice) filter.price = { $gte: minPrice };
    if (maxPrice) filter.price = { ...filter.price, $lte: maxPrice };

    const properties = await Property.find(filter);
    res.json(properties);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching properties', 
      error: error.message 
    });
  }
};