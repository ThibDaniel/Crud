const express = require('express');
const bodyParser = require('body-parser');
const Joi = require('joi');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

let planets = [
  { id: 1, name: 'Mercury' },
  { id: 2, name: 'Venus' },
  { id: 3, name: 'Earth' },
  { id: 4, name: 'Mars' }
];

const planetSchema = Joi.object({
  id: Joi.number().integer().required(),
  name: Joi.string().min(3).required()
});

app.get('/api/planets', (req, res) => {
  res.status(200).json(planets);
});

app.get('/api/planets/:id', (req, res) => {
  const planet = planets.find(p => p.id === parseInt(req.params.id));
  if (!planet) return res.status(404).json({ msg: 'Planet not found' });
  res.status(200).json(planet);
});

app.post('/api/planets', (req, res) => {
  const { error } = planetSchema.validate(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  const newPlanet = {
    id: planets.length + 1,
    name: req.body.name
  };

  planets.push(newPlanet);
  res.status(201).json({ msg: 'Planet created successfully' });
});

app.put('/api/planets/:id', (req, res) => {
  const planet = planets.find(p => p.id === parseInt(req.params.id));
  if (!planet) return res.status(404).json({ msg: 'Planet not found' });

  const { error } = planetSchema.validate({ ...req.body, id: planet.id });
  if (error) return res.status(400).json({ msg: error.details[0].message });

  planet.name = req.body.name;
  res.status(200).json({ msg: 'Planet updated successfully' });
});

app.delete('/api/planets/:id', (req, res) => {
  const planetIndex = planets.findIndex(p => p.id === parseInt(req.params.id));
  if (planetIndex === -1) return res.status(404).json({ msg: 'Planet not found' });

  planets.splice(planetIndex, 1);
  res.status(200).json({ msg: 'Planet deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});