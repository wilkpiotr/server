const express = require('express')
const router = express.Router();
const uuidv1 = require('uuid/v1');
const fileDb = require('../file.db')('todoapp/todo');

// define the home page route
router.get('/', function (req, res) {
  fileDb.get().then((data) => {
    res.send(data);
  });
});

router.post('/', function (req, res) {
  
  fileDb.get().then((data = []) => {
    const id = uuidv1();
    data.push({
      id,
      task: req.body.task || 'No task info',
      done: false
    });
    return { data, id };
  }).then(({data, id}) => {
    return fileDb.save(data).then(() => res.send({id}));
  });
  
});

router.put('/:id', function (req, res) {
  fileDb.get().then((data = []) => {
    const newdata = data.map((task) => {
      if (task.id === req.params.id) {
        return {
          ...task, 
          id: task.id,
          task: req.body.task
        }
      }
      return task;
    });

    return { data: newdata, id: req.params.id };
  }).then(({data, id}) => {
    return fileDb.save(data).then(() => res.send({id}));
  }).catch((e) => {
    res.status(500).send(e.message);
  });
});


router.patch('/done/:id', function (req, res) {
  fileDb.get().then((data = []) => {
    const newdata = data.map((task) => {
      if (task.id === req.params.id) {
        return {...task, done: true}
      }
      return task;
    });
    return { data: newdata, id: req.params.id };
  }).then(({data, id}) => {
    return fileDb.save(data).then(() => res.send({id}));
  }).catch((e) => {
    res.status(500).send(e.message);
  });
});


router.patch('/undone/:id', function (req, res) {
  fileDb.get().then((data = []) => {
    const newdata = data.map((task) => {
      if (task.id === req.params.id) {
        return {...task, done: false}
      }
      return task;
    });
    return { data: newdata, id: req.params.id };
  }).then(({data, id}) => {
    return fileDb.save(data).then(() => res.send({id}));
  }).catch((e) => {
    res.status(500).send(e.message);
  });
});

router.delete('/:id', function (req, res) {
  fileDb.get().then((data = []) => {
    const newdata = data.filter((task) => task.id !== req.params.id);
    return { data: newdata, id: req.params.id };
  }).then(({data, id}) => {
    return fileDb.save(data).then(() => res.send({id}));
  }).catch((e) => {
    res.status(500).send(e.message);
  });
});


module.exports = router