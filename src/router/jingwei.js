export default [
  {
    path: '/jw/index',
    name: '精卫cbt课程详情',
    meta: { title: '精卫cbt课程详情' },
    component: resolve => require(['../views/jingwei/index.vue'], resolve)
  },
  {
    path: '/jw/courses',
    name: '学习记录',
    meta: { title: '学习记录' },
    component: resolve => require(['../views/jingwei/records-course.vue'], resolve)
  },
  {
    path: '/jw/Subcourses',
    name: '课程列表',
    meta: { title: '课程列表' },
    component: resolve => require(['../views/jingwei/records-Subcourse.vue'], resolve)
  },
  {
    path: '/jw/doing-course',
    name: '课程模板',
    meta: { title: 'cbt课程' },
    component: resolve => require(['../views/jingwei/doing-course/index.vue'], resolve)
  },
  {
    path: '/jw/doing-course-relax',
    name: '呼吸放松练习',
    meta: { title: '呼吸放松一下' },
    component: resolve => require(['../views/jingwei/doing-course-relax.vue'], resolve)
  },
  {
    path: '/jw/course-detail',
    name: '小课详情',
    meta: { title: '课程详情' },
    component: resolve => require(['../views/jingwei/course-detail/index.vue'], resolve)
  }
]
