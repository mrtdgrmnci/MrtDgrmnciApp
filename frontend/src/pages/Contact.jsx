import { useState } from 'react'
import { useMutation } from 'react-query'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Mail, Phone, MapPin, Send, CheckCircle, MessageSquare, User, Zap } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { contactAPI } from '../services/api'
import toast from 'react-hot-toast'

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const submitMutation = useMutation(contactAPI.submit, {
    onSuccess: () => {
      setIsSubmitted(true)
      reset()
      toast.success('Message sent successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to send message. Please try again.')
    }
  })

  const onSubmit = (data) => {
    submitMutation.mutate(data)
  }

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'your.email@example.com',
      link: 'mailto:your.email@example.com'
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+1 (555) 123-4567',
      link: 'tel:+15551234567'
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'San Francisco, CA',
      link: null
    }
  ]

  if (isSubmitted) {
    return (
      <>
        <Helmet>
          <title>Message Sent - MRT Portfolio</title>
          <meta name="description" content="Thank you for your message. I'll get back to you soon!" />
        </Helmet>

        <section className="section-padding pt-24">
          <div className="container mx-auto container-padding">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="max-w-md mx-auto text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-neon-green to-neon-cyan rounded-full flex items-center justify-center">
                <CheckCircle className="text-white" size={32} />
              </div>
              <h1 className="text-3xl font-futuristic font-bold mb-4 text-gradient-green">Message Sent!</h1>
              <p className="text-futuristic-300 mb-8">
                Thank you for reaching out. I'll get back to you as soon as possible.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="btn-futuristic"
              >
                Send Another Message
              </button>
            </motion.div>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>Contact - MRT Portfolio</title>
        <meta name="description" content="Get in touch with me for collaboration, questions, or just to say hello!" />
      </Helmet>

      <section className="section-padding pt-24">
        <div className="container mx-auto container-padding">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-futuristic-800/50 border border-neon-cyan/30 rounded-full text-neon-cyan text-sm font-medium mb-6">
              <MessageSquare className="w-4 h-4" />
              <span>Get In Touch</span>
            </div>
            
            <h1 className="text-responsive-3xl font-futuristic font-bold mb-6 text-gradient-blue">
              Let's Connect
            </h1>
            <p className="text-lg text-futuristic-300 max-w-3xl mx-auto">
              Ready to start a project or just want to say hello? I'd love to hear from you!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="card-futuristic p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-neon-blue to-neon-cyan rounded-lg flex items-center justify-center">
                    <Send className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-futuristic font-bold text-futuristic-100">Send Message</h2>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-futuristic-300 text-sm font-medium mb-2">
                        Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-futuristic-400" size={16} />
                        <input
                          type="text"
                          {...register('name', { required: 'Name is required' })}
                          className="input-futuristic pl-10"
                          placeholder="Your name"
                        />
                      </div>
                      {errors.name && (
                        <p className="text-neon-red text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-futuristic-300 text-sm font-medium mb-2">
                        Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-futuristic-400" size={16} />
                        <input
                          type="email"
                          {...register('email', { 
                            required: 'Email is required',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Invalid email address'
                            }
                          })}
                          className="input-futuristic pl-10"
                          placeholder="your.email@example.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-neon-red text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-futuristic-300 text-sm font-medium mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      {...register('subject', { required: 'Subject is required' })}
                      className="input-futuristic"
                      placeholder="What's this about?"
                    />
                    {errors.subject && (
                      <p className="text-neon-red text-sm mt-1">{errors.subject.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-futuristic-300 text-sm font-medium mb-2">
                      Message *
                    </label>
                    <textarea
                      {...register('message', { required: 'Message is required' })}
                      rows={6}
                      className="input-futuristic resize-none"
                      placeholder="Tell me about your project or just say hello..."
                    />
                    {errors.message && (
                      <p className="text-neon-red text-sm mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={submitMutation.isLoading}
                    className="btn-futuristic w-full group"
                  >
                    {submitMutation.isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="spinner-futuristic w-5 h-5 mr-2"></div>
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-neon-purple to-neon-pink rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-futuristic font-bold text-futuristic-100">Contact Info</h2>
                </div>
                <p className="text-futuristic-300 mb-8">
                  Feel free to reach out through any of these channels. I'm always excited to hear about new opportunities and collaborations.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    className="card-futuristic p-6"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-neon-blue to-neon-cyan rounded-lg flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-futuristic font-semibold text-futuristic-100 mb-1">
                          {info.title}
                        </h3>
                        {info.link ? (
                          <a
                            href={info.link}
                            className="text-neon-cyan hover:text-neon-blue transition-colors duration-300"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-futuristic-300">{info.value}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Additional Info */}
              <div className="card-futuristic p-6">
                <h3 className="font-futuristic font-semibold text-futuristic-100 mb-4">
                  Response Time
                </h3>
                <p className="text-futuristic-300 mb-4">
                  I typically respond to messages within 24 hours during business days.
                </p>
                <div className="flex items-center space-x-2 text-neon-green">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Usually responds within 24 hours</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Contact 