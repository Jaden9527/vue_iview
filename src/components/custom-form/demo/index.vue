<template>
  <div>
    <h2>垂直表单</h2>
    <custom-form
      :form-list="filters"
      :inline="false"
      :label-width="80"
      label-position="right"
      :has-submit-btn="true"
      @submit="onSubmit"
      submit-text="查询"
    ></custom-form>
    <h2>水平表单</h2>
    <custom-form
      ref="lineForm"
      :form-list="filters"
      :actions="actions"
      :inline="true"
      :label-width="80"
      label-position="left"
      :has-submit-btn="true"
      @submit="onSubmit"
      submit-text="查询"
    ></custom-form>
    <h2>在配置前加内容</h2>
    <custom-form
      :form-list="filters"
      :inline="false"
      :label-width="80"
      label-position="right"
      :has-submit-btn="true"
      @submit="onSubmit"
      submit-text="查询"
    >
      <FormItem slot="prepend" label="Slider">
        <button>上传证书</button>
      </FormItem>
    </custom-form>
    <h2>在配置后加内容</h2>
    <custom-form
      :form-list="filters"
      :inline="false"
      :label-width="80"
      label-position="right"
      :has-submit-btn="true"
      @submit="onSubmit"
      submit-text="查询"
    >
      <FormItem label="Slider">
        <button>上传证书</button>
      </FormItem>
    </custom-form>
    <h2>配置内自定义整行渲染内容</h2>
    <custom-form
      :form-list="filtersRenderLine"
      :inline="false"
      :label-width="80"
      label-position="right"
      :has-submit-btn="true"
      @submit="onSubmit"
      submit-text="查询"
    ></custom-form>
    <h2>配置内自定义内容</h2>
    <custom-form
      :form-list="filtersRenderContent"
      :inline="false"
      :label-width="80"
      label-position="right"
      :has-submit-btn="true"
      @submit="onSubmit"
      submit-text="查询"
    ></custom-form>
    <h2>级联选择</h2>
    <custom-form
      :form-list="filters3"
      :inline="false"
      :label-width="80"
      label-position="right"
      :has-submit-btn="true"
      @submit="onSubmit"
      submit-text="查询"
    ></custom-form>
  </div>
</template>
<script>
import CustomForm from '@/components/custom-form/index.vue'
export default {
  name: 'formDemo',
  components: {
    CustomForm
  },
  data() {
    return {
      filters3: [
        {
          label: '级联',
          type: 'cascader',
          key: 'cascader',
          options: [
            {
              value: 'zhinan',
              text: '指南',
              children: [
                {
                  value: 'shejiyuanze',
                  text: '设计原则',
                  children: [
                    {
                      value: 'yizhi',
                      text: '一致'
                    },
                    {
                      value: 'fankui',
                      text: '反馈'
                    },
                    {
                      value: 'xiaolv',
                      text: '效率'
                    },
                    {
                      value: 'kekong',
                      text: '可控'
                    }
                  ]
                },
                {
                  value: 'daohang',
                  text: '导航',
                  children: [
                    {
                      value: 'cexiangdaohang',
                      text: '侧向导航'
                    },
                    {
                      value: 'dingbudaohang',
                      text: '顶部导航'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      filtersRenderLine: [
        {
          renderLine: (h, item, form) => {
            h = this.$createElement
            console.log({ ...form })
            return h('h2', { ref: 'custom' }, '我猜你可能需要整个自定义')
          }
        }
      ],
      filtersRenderContent: [
        {
          label: '你好哇',
          key: 'c2',
          renderContent: (h, item, form) => {
            let $input = h('i-input', {
              props: {
                value: form['custom']
              },
              style: {
                width: '240px'
              },
              ref: 'c2',
              on: {
                input: value => {
                  form['custom'] = value
                }
              }
            })
            return h('div', [
              $input,
              h(
                'p',
                {
                  style: {
                    color: '#999'
                  }
                },
                '这里是自定义 content'
              )
            ])
          }
        }
      ],
      filters: [
        {
          label: '姓名',
          type: 'input',
          key: 'name',
          rule: { required: true, message: '请输入姓名', trigger: 'blur' }
        },
        {
          label: '你是谁',
          type: 'input',
          key: 'h',
          rule: { required: true, message: '请输入你是谁', trigger: 'blur' }
        },
        {
          label: '我是谁',
          type: 'input',
          key: 'y'
        },
        {
          label: '特长',
          type: 'select',
          key: 'interest',
          defaultValue: [],
          props: {
            multiple: true,
            placeholder: '请选择兴趣'
          },
          options: [
            {
              value: 0,
              text: '上班'
            },
            {
              value: 1,
              text: '吃饭'
            },
            {
              value: 2,
              text: '睡觉'
            },
            {
              value: 3,
              text: '偷懒'
            }
          ]
        },
        {
          label: '协议',
          type: 'checkbox',
          text: '我同意',
          key: 'argee'
        },
        {
          label: '喜欢的食物',
          type: 'checkbox-group',
          key: 'foods',
          width: 'auto',
          options: [
            {
              value: 0,
              text: '草莓'
            },
            {
              value: 1,
              text: '酸奶'
            },
            {
              value: 2,
              text: '面包'
            },
            {
              value: 3,
              text: '鸡蛋'
            }
          ]
        },
        {
          label: '不存在的食物',
          type: 'radio-group',
          key: 'radio-group',
          defaultValue: 0,
          width: 'auto',
          options: [
            {
              value: 0,
              text: '冬瓜'
            },
            {
              value: 1,
              text: '西瓜'
            },
            {
              value: 2,
              text: '南瓜'
            },
            {
              value: 3,
              text: '北瓜'
            }
          ]
        },
        {
          label: '开关',
          type: 'switch',
          key: 'switch'
        },
        {
          label: 'date',
          type: 'date',
          key: 'birthday'
        },
        {
          label: 'datetime',
          type: 'datetime',
          key: 'datetime'
        },
        {
          label: 'daterange',
          type: 'daterange',
          key: 'daterange'
        },
        {
          label: 'datetimerange',
          type: 'datetimerange',
          key: 'datetimerange'
        },
        {
          label: 'time',
          type: 'time',
          key: 'time'
        }
      ],
      actions: [
        {
          content: '调用组件内的方法',
          type: 'primary',
          size: 'large',
          on: () => {
            this.$refs.lineForm.submit()
          }
        },
        {
          content: '自定义函数',
          type: 'primary',
          size: 'large',
          on: () => {
            this.$Message.info('睡觉睡觉睡觉是')
          }
        },
        {
          content: '没函数',
          type: 'primary',
          size: 'large'
        }
      ]
    }
  },
  methods: {
    onSubmit(form, valid) {
      if (valid) {
        this.$Notice.info({
          title: '你得到的值',
          desc: '请在 console 里面看你得到的值'
        })
        console.log(form, valid)
      } else {
        console.log(form, valid)
        this.$Message.error('验证失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
h2 {
  padding: 30px 0;
}
</style>
