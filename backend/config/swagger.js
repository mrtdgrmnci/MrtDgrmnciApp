const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MrtDgrmnci Portfolio API',
      version: '1.0.0',
      description: 'A comprehensive API for managing a QA automation portfolio with authentication, projects, blog posts, and contact management.',
      contact: {
        name: 'Mert Dogru',
        email: 'mrtdgrmnci@gmail.com',
        url: 'https://github.com/mrtdgrmnci'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://api.yourdomain.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token for authentication'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'User ID'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            role: {
              type: 'string',
              enum: ['admin', 'user'],
              description: 'User role'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'User password (minimum 6 characters)'
            }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Login successful'
            },
            token: {
              type: 'string',
              description: 'JWT authentication token'
            },
            user: {
              $ref: '#/components/schemas/User'
            }
          }
        },
        Project: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Project ID'
            },
            title: {
              type: 'string',
              description: 'Project title'
            },
            description: {
              type: 'string',
              description: 'Project description'
            },
            technologies: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Technologies used in the project'
            },
            image_url: {
              type: 'string',
              format: 'uri',
              description: 'Project image URL'
            },
            github_url: {
              type: 'string',
              format: 'uri',
              description: 'GitHub repository URL'
            },
            live_url: {
              type: 'string',
              format: 'uri',
              nullable: true,
              description: 'Live demo URL'
            },
            featured: {
              type: 'boolean',
              description: 'Whether the project is featured'
            },
            order_index: {
              type: 'integer',
              description: 'Display order index'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Project creation timestamp'
            }
          }
        },
        ContactMessage: {
          type: 'object',
          required: ['name', 'email', 'message'],
          properties: {
            name: {
              type: 'string',
              minLength: 1,
              maxLength: 100,
              description: 'Contact person name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Contact person email'
            },
            subject: {
              type: 'string',
              maxLength: 200,
              description: 'Message subject (optional)'
            },
            message: {
              type: 'string',
              minLength: 10,
              maxLength: 2000,
              description: 'Message content'
            }
          }
        },
        ContactResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Message sent successfully'
            }
          }
        },
        BlogPost: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Blog post ID'
            },
            title: {
              type: 'string',
              description: 'Blog post title'
            },
            slug: {
              type: 'string',
              description: 'URL slug'
            },
            excerpt: {
              type: 'string',
              description: 'Post excerpt'
            },
            content: {
              type: 'string',
              description: 'Post content (markdown)'
            },
            tags: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Post tags'
            },
            published: {
              type: 'boolean',
              description: 'Publication status'
            },
            published_at: {
              type: 'string',
              format: 'date-time',
              description: 'Publication timestamp'
            }
          }
        },
        Skill: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Skill ID'
            },
            name: {
              type: 'string',
              description: 'Skill name'
            },
            proficiency: {
              type: 'integer',
              minimum: 0,
              maximum: 100,
              description: 'Proficiency level (0-100)'
            },
            category: {
              type: 'string',
              description: 'Skill category'
            },
            icon: {
              type: 'string',
              description: 'FontAwesome icon class'
            },
            order_index: {
              type: 'integer',
              description: 'Display order index'
            }
          }
        },
        Experience: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Experience ID'
            },
            title: {
              type: 'string',
              description: 'Job title'
            },
            company: {
              type: 'string',
              description: 'Company name'
            },
            location: {
              type: 'string',
              description: 'Job location'
            },
            start_date: {
              type: 'string',
              format: 'date',
              description: 'Start date (YYYY-MM)'
            },
            end_date: {
              type: 'string',
              format: 'date',
              nullable: true,
              description: 'End date (YYYY-MM)'
            },
            current: {
              type: 'boolean',
              description: 'Whether this is the current position'
            },
            description: {
              type: 'string',
              description: 'Job description'
            },
            technologies: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Technologies used'
            },
            order_index: {
              type: 'integer',
              description: 'Display order index'
            }
          }
        },
        Education: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Education ID'
            },
            degree: {
              type: 'string',
              description: 'Degree name'
            },
            institution: {
              type: 'string',
              description: 'Institution name'
            },
            location: {
              type: 'string',
              description: 'Institution location'
            },
            start_date: {
              type: 'string',
              format: 'date',
              description: 'Start date (YYYY-MM)'
            },
            end_date: {
              type: 'string',
              format: 'date',
              nullable: true,
              description: 'End date (YYYY-MM)'
            },
            current: {
              type: 'boolean',
              description: 'Whether currently enrolled'
            },
            description: {
              type: 'string',
              description: 'Education description'
            },
            gpa: {
              type: 'string',
              nullable: true,
              description: 'GPA score'
            },
            order_index: {
              type: 'integer',
              description: 'Display order index'
            }
          }
        },
        AdminDashboard: {
          type: 'object',
          properties: {
            projects: {
              type: 'object',
              properties: {
                total: {
                  type: 'integer',
                  description: 'Total number of projects'
                },
                featured: {
                  type: 'integer',
                  description: 'Number of featured projects'
                }
              }
            },
            resume: {
              type: 'object',
              properties: {
                skills: {
                  type: 'integer',
                  description: 'Total number of skills'
                },
                experience: {
                  type: 'integer',
                  description: 'Total number of experience entries'
                },
                education: {
                  type: 'integer',
                  description: 'Total number of education entries'
                }
              }
            },
            blog: {
              type: 'object',
              properties: {
                total: {
                  type: 'integer',
                  description: 'Total number of blog posts'
                },
                published: {
                  type: 'integer',
                  description: 'Number of published posts'
                },
                drafts: {
                  type: 'integer',
                  description: 'Number of draft posts'
                }
              }
            },
            contact: {
              type: 'object',
              properties: {
                total: {
                  type: 'integer',
                  description: 'Total number of contact messages'
                },
                unread: {
                  type: 'integer',
                  description: 'Number of unread messages'
                },
                recent: {
                  type: 'integer',
                  description: 'Number of recent messages'
                }
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error type'
            },
            message: {
              type: 'string',
              description: 'Error message'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    description: 'Field name'
                  },
                  message: {
                    type: 'string',
                    description: 'Validation message'
                  }
                }
              },
              description: 'Validation errors'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints'
      },
      {
        name: 'Projects',
        description: 'Portfolio projects management'
      },
      {
        name: 'Contact',
        description: 'Contact form and message management'
      },
      {
        name: 'Blog',
        description: 'Blog posts management'
      },
      {
        name: 'Resume',
        description: 'Resume data (skills, experience, education)'
      },
      {
        name: 'Admin',
        description: 'Admin dashboard and management endpoints'
      },
      {
        name: 'Health',
        description: 'System health and status endpoints'
      }
    ]
  },
  apis: ['./routes/*.js', './server.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs; 