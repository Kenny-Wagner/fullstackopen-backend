const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const api = supertest(app)

beforeEach( async () => {

 await Blog.deleteMany({})

 const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog))

 const promiseArray = blogObjects.map((blog) => blog.save())

 await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  
  assert.strictEqual(response.body.length, helper.initialBlogs.length)

})

test('blogs formatted correctly', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  
  const blogObjects = response.body.map((blog) => blog)
  blogObjects.forEach((blog) => assert(Object.keys(blog).includes("id")))
})

test('new blog successfully added to db', async () => {
  const newBlog =  {
    title: "Test Title",
    author: "test name",
    url: "www.testurl.com",
    likes: 5,
  }

   await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
    const updatedDb = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    assert.strictEqual(updatedDb.body.length, helper.initialBlogs.length+1)
})


test('Blog without likes is added with 0 likes', async () => {
  const newBlog =  {
    title: "Test Title",
    author: "test name",
    url: "www.testurl.com"
  }

   const newBlogResponse = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
    assert.strictEqual(newBlogResponse.body.likes, 0)
})


test('New blog without title returns bad request', async () => {
  const newBlog =  {
    author: "test name",
    url: "www.testurl.com",
    likes: 3
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})

test('New blog without url returns bad request', async () => {
  const newBlog =  {
    title: "Test Title",
    author: "test name",
    likes: 3
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})


test('Blog successfully deleted from database', async () => {
  const blogs = await helper.blogsInDb()
  await api
    .delete(`/api/blogs/${blogs[0].id}`)
    .expect(204)
  
  await api
    .get(`/api/blogs/${blogs[0].id}`)
    .expect(404)
})

test('Blog successfully updated in database', async () => {
  const blogs = await helper.blogsInDb()
  let updatedBlog = blogs[0]
  updatedBlog.likes++
  const updatedResponse = await api
    .put(`/api/blogs/${updatedBlog.id}`)
    .send(updatedBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  
    assert.strictEqual(updatedResponse.body.likes, updatedBlog.likes)
})
after(async () => {
  await mongoose.connection.close()
})