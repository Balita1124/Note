MEAN : MongoDB, ExpressJS, Angular and Node.js

Setting Up The Angular 6 Project With Angular CLI
==================================================
$ ng new frontend

$ cd frontend

$ ng serve --open

Adding angular material
------------------------------------

$ ng add @angular/material

Creating components
-------------------------

$ ng g c components/list

$ ng g c components/create

$ ng g c components/edit

Adding Routing (app.module.ts)
------------------------

import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: 'create', component: CreateComponent },
  { path: 'edit/:id', component: EditComponent },
  { path: 'list', component: ListComponent },
  { path: '', redirectTo: '/list', pathMatch: 'full'}
];


imports: [
    ...
    RouterModule.forRoot(routes)
  ],
  
Setting up app.component.html
----------------------------------
<mat-toolbar>
  <span>Angular 6 - MEAN Stack Sample Application</span>
</mat-toolbar>
<div>
  <router-outlet></router-outlet>
</div>

activate MatToolbarModule  module (app.module.ts)
--------------------------------------------------
import { MatToolbarModule } from '@angular/material';

imports: [
    ...
    MatToolbarModule
 ],
 
 Setting up backend project
 ===============================
 
 $ mkdir backend
 
 $ cd backend
 
 $ npm init -y
 
 Setting Up Babel
 ---------------------------
 babel is a compiler
 
 $ npm install --save-dev babel-cli babel-preset-env
 
 $ npm install -g --save-dev @babel/cli @babel/preset-env
 
 
 Once installed you need to add a .babelrc file to the project and add the following content:
 
{
  "presets": ["env"]
}

ou

{
  "presets": [
    "@babel/preset-env",
  ]
}

installing babel-watch
-----------------------------
Automate compilation with babel-watch

$ npm install babel-watch --save-dev

then use babel watch in your packages.json file in the script section, like this:

"scripts": {
    "dev": "babel-watch server.js"
}

run the server
--------------------
$ npm run dev


Installing express
---------------------------
role: implementing the server

$ npm install express

Mongoose is a library to access mongoDB

$ npm install mongoose

CORS (Cross-Origin Resource Sharing)

$ npm install cors

Implementing the server
===================================

$ touch server.js

setting up server.js file
--------------------------
import express from 'express';

const app = express();
app.get('/', (req, res) => res.send('Hello World!'));
app.listen(4000, () => console.log(`Express server running on port 4000`));


starting the server process
-----------------------------

$ npm run dev

Extending the server implementation
=====================================
change server.js
------------------------

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';const app = express();
const router = express.Router();app.use(cors());
app.use(bodyParser.json());
mongoose.connect('mongodb://[server]/issues');
const connection = mongoose.connection;connection.once('open', () => {
    console.log('MongoDB database connection established successfully!');
});
app.use('/', router);
app.listen(4000, () => console.log(`Express server running on port 4000`));

Adding model (models/Issue.js)
-----------------------------

import mongoose from 'mongoose';const Schema = mongoose.Schema;let Issue = new Schema({
    title: {
        type: String
    },
    responsible: {
        type: String 
    },
    description: {
        type: String
    },
    severity: {
        type: String
    },
    status: {
        type: String,
        default: 'Open'
    }
});export default mongoose.model('Issue', Issue);

importing model in server.js
--------------------------------
import Issue from './models/Issue';

Setting up routes
-------------------------
//all issues
router.route('/issues').get((req, res) => {
    Issue.find((err, issues) => {
        if (err)
            console.log(err);
        else
            res.json(issues);
    });
});

// retrieving issues by id
router.route('/issues/:id').get((req, res) => {
    Issue.findById(req.params.id, (err, issue) => {
        if (err)
            console.log(err);
        else
            res.json(issue);
    })
});

//adding new issue

router.route('/issues/add').post((req, res) => {
    let issue = new Issue(req.body);
    issue.save()
        .then(issue => {
            res.status(200).json({'issue': 'Added successfully'});
        })
        .catch(err => {
            res.status(400).send('Failed to create new record');
        });
});

//Updating issues

router.route('/issues/update/:id').post((req, res) => {
    Issue.findById(req.params.id, (err, issue) => {
        if (!issue)
            return next(new Error('Could not load Document'));
        else {
            issue.title = req.body.title;
            issue.responsible = req.body.responsible;
            issue.description = req.body.description;
            issue.severity = req.body.severity;
            issue.status = req.body.status;            issue.save().then(issue => {
                res.json('Update done');
            }).catch(err => {
                res.status(400).send('Update failed');
            });
        }
    });
});

//Deleting issue

router.route('/issues/delete/:id').get((req, res) => {
    Issue.findByIdAndRemove({_id: req.params.id}, (err, issue) => {
        if (err)
            res.json(err);
        else
            res.json('Removed successfully');
    });
});


exemple of complete code server.js
------------------------------------
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import Issue from './models/Issue';
const app = express();
const router = express.Router();
app.use(cors());
app.use(bodyParser.json());
mongoose.connect('mongodb://[server]/issues');
const connection = mongoose.connection;connection.once('open', () => {
    console.log('MongoDB database connection established successfully!');
});
router.route('/issues/add').post((req, res) => {
    let issue = new Issue(req.body);
    issue.save()
        .then(issue => {
            res.status(200).json({'issue': 'Added successfully'});
        })
        .catch(err => {
            res.status(400).send('Failed to create new record');
        });
});
router.route('/issues').get((req, res) => {
    Issue.find((err, issues) => {
        if (err)
            console.log(err);
        else
            res.json(issues);
    });
});
router.route('/issues/:id').get((req, res) => {
    Issue.findById(req.params.id, (err, issue) => {
        if (err)
            console.log(err);
        else
            res.json(issue);
    })
});
router.route('/issues/update/:id').post((req, res) => {
    Issue.findById(req.params.id, (err, issue) => {
        if (!issue)
            return next(new Error('Could not load Document'));
        else {
            issue.title = req.body.title;
            issue.responsible = req.body.responsible;
            issue.description = req.body.description;
            issue.severity = req.body.severity;
            issue.status = req.body.status;            issue.save().then(issue => {
                res.json('Update done');
            }).catch(err => {
                res.status(400).send('Update failed');
            });
        }
    });
});
router.route('/issues/delete/:id').get((req, res) => {
    Issue.findByIdAndRemove({_id: req.params.id}, (err, issue) => {
        if (err)
            res.json(err);
        else
            res.json('Removed successfully');
    });
});
app.use('/', router);app.listen(4000, () => console.log(`Express server running on port 4000`));

Setting up mongoDB
=======================
Create a data directory
-----------------------------
$ mkdir -p /data/db

