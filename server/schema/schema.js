//const {projects, clients} = require('../sampleData')

// Mongoose models

const Project = require('../models/Projects')
const Clint = require('../models/Clients')


const {GraphQLObjectType,
     GraphQLID, 
     GraphQLString,
      GraphQLSchema,
      GraphQLList
    }= require('graphql')

// Client 

const ClinetType = new GraphQLObjectType({
    name: 'Client',
    fields: ()=>({
        id: { type: GraphQLID},
        name: { type: GraphQLString},
        email: { type: GraphQLString},
        phone: { type: GraphQLString},
    }),
})

// projects 

const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: ()=>({
        id: { type: GraphQLID},
        name: { type: GraphQLString},
        description: { type: GraphQLString},
        status: { type: GraphQLString},
        client:{
            type: ClinetType,
            resolve(parent, args){
                return Clint.findById(parent.clientId)
            }
        }
    }),
})

const RootQuery = new GraphQLObjectType({
    name:  'RootQueryType',
    fields:{
        clients: {
            type: new GraphQLList(ClinetType),
            resolve(parent, args){
                return Clint.find()
            }
        },
        client:{
            type: ClinetType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                return Clint.findById(args.id)
            },
        },
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent, args){
                return Project.find()
            }
        },
        project:{
            type: ProjectType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                return Project.findById(args.id)
            },
        },
    },
})

module.exports = new GraphQLSchema({
    query: RootQuery,
})