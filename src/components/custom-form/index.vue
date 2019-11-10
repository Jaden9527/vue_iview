<script>
// interface Tag {
//   h: any
//   item: any
//   tagName: string
//   props?: any
//   children?: Array<any>
//   on?: () => void
//   nativeOn?: () => void
// }

const getPrefix = tag => {
  let iviewMap = {
    form: 'i-form',
    'form-item': 'form-item',
    input: 'i-input',
    select: 'i-select',
    option: 'i-option',
    checkbox: 'checkbox',
    'checkbox-group': 'checkbox-group',
    'date-picker': 'date-picker',
    'time-picker': 'time-picker',
    radio: 'radio',
    'radio-group': 'radio-group',
    switch: 'i-switch',
    slider: 'slider',
    button: 'i-button',
    row: 'row',
    col: 'i-col',
    'input-number': 'input-number',
    cascader: 'cascader'
  }
  return iviewMap[tag]
}
export default {
  name: 'customForm',
  props: {
    // 自定义按钮 项
    actions: {
      type: Array,
      default: function() {
        return []
      }
    },
    // formItem 项
    formList: {
      type: Array,
      default: function() {
        return []
      }
    },
    // 提交按钮
    submitText: {
      type: String,
      default: function() {
        return '提交'
      }
    },
    // 重置按钮
    resetText: {
      type: String,
      default: function() {
        return '重置'
      }
    },
    // 是否拥有 提交 按钮
    hasSubmitBtn: {
      type: Boolean,
      default: function() {
        return true
      }
    },
    // 是否拥有 重置 按钮
    hasResetBtn: {
      type: Boolean,
      default: function() {
        return true
      }
    },
    // 开启全局 clearable
    clearable: {
      type: Boolean,
      default: function() {
        return true
      }
    },
    // 是否开启行内表单模式
    inline: {
      type: Boolean,
      default: function() {
        return true
      }
    },
    // 默认标签宽度
    labelWidth: {
      type: Number,
      default: function() {
        return 100
      }
    },
    // 默认标签位置
    labelPosition: {
      type: String,
      default: function() {
        return 'right'
      }
    },
    // 默认内容宽度
    contentWidth: {
      type: [Number, String],
      default: function() {
        return 240
      }
    }
  },
  data() {
    return {
      form: this.initForm()
    }
  },
  computed: {
    rules() {
      let rules = {}
      this.formList.forEach(item => {
        if (item.rule !== undefined) {
          rules[item.key] = item.rule
        }
      })
      return rules
    }
  },
  // https://cn.vuejs.org/v2/guide/render-function.html#%E6%B7%B1%E5%85%A5%E6%95%B0%E6%8D%AE%E5%AF%B9%E8%B1%A1
  // h()函数接收参数解释
  render(h) {
    return h(
      getPrefix('form'),
      {
        props: {
          model: this.form,
          labelWidth: this.labelWidth,
          labelPosition: this.labelPosition,
          inline: this.inline,
          rules: this.rules
        },
        ref: 'form',
        nativeOn: {
          submit(e) {
            e.preventDefault()
            e.stopPropagation()
          }
        }
      },
      [
        this.$slots.prepend,
        this.renderFormList(h),
        this.$slots.default,
        this.renderSubmit(h)
      ]
    )
  },
  methods: {
    // 初始化默认值，重置表单的时候会有用
    initForm() {
      let form = {}
      let defaultMap = {
        input: '',
        select: null,
        checkbox: false,
        'checkbox-group': [],
        date: new Date(),
        datetime: new Date(),
        daterange: [],
        datetimerange: [],
        time: '',
        radio: false,
        'radio-group': '',
        slider: 0,
        switch: false,
        'input-number': 0,
        cascader: []
      }
      this.formList.forEach(item => {
        let defaultValue = ''
        defaultValue =
          item.defaultValue !== undefined
            ? item.defaultValue
            : defaultMap[item.type]
        if (item.key) {
          form[item.key] = defaultValue
        }
      })
      return form
    },
    getContent(h, item) {
      let content
      switch (item.type) {
        case 'input':
          content = this.renderInput(h, item)
          break
        case 'select':
          content = this.renderSelect(h, item)
          break
        case 'checkbox':
          content = this.renderCheckbox(h, item)
          break
        case 'checkbox-group':
          content = this.renderCheckboxGroup(h, item)
          break
        case 'radio-group':
          content = this.renderRadioGroup(h, item)
          break
        case 'switch':
          content = this.renderSwitch(h, item)
          break
        case 'date':
        case 'datetime':
          content = this.renderDatePicker(h, item)
          break
        case 'daterange':
        case 'datetimerange':
          content = this.renderDateRange(h, item)
          break
        case 'time':
          content = this.renderTimePicker(h, item)
          break
        case 'cascader':
          content = this.renderCascader(h, item)
          break
        default:
          if (typeof item.renderContent === 'function') {
            content = item.renderContent(this.getHypeScript(), item, this.form)
          } else {
            h('span', '')
          }
          break
      }
      return content
    },
    // 渲染 input
    renderInput(h, item) {
      let props = item.props || {}
      let attrs = item.attrs || {}
      if (props.placeholder) {
        attrs.placeholder = props.placeholder
      }
      item.attrs = attrs
      let tag = {
        h,
        item,
        tagName: getPrefix('input'),
        props: {
          clearable: this.clearable,
          ...props
        }
      }
      return this.generateTag(tag)
    },
    // 渲染 select
    renderSelect(h, item) {
      let tag = {
        h,
        item,
        tagName: getPrefix('select'),
        props: {
          clearable: this.clearable,
          ...(item.props || {})
        },
        children: item.options.map(option => {
          return h(
            getPrefix('option'),
            {
              props: {
                label: option.text,
                value: option.value
              }
            },
            [
              typeof item.renderOption === 'function'
                ? item.renderOption(h, option, item)
                : item.text
            ]
          )
        })
      }
      return this.generateTag(tag)
    },
    // 渲染 单个checkbox
    renderCheckbox(h, item) {
      let props = item.props || {}
      if (item.border) {
        props.border = true
      }
      let tag = {
        h,
        item,
        tagName: getPrefix('checkbox'),
        props,
        children: item.text
      }
      return this.generateTag(tag)
    },
    // 渲染 checkbox group
    renderCheckboxGroup(h, item) {
      let tag = {
        h,
        item,
        tagName: getPrefix('checkbox-group'),
        props: item.props || {},
        children: item.options.map(option => {
          return h(
            getPrefix('checkbox'),
            {
              props: {
                border: item.border,
                label: option.value
              }
            },
            option.text
          )
        })
      }
      return this.generateTag(tag)
    },
    // 渲染 radio group
    renderRadioGroup(h, item) {
      let tag = {
        h,
        item,
        tagName: getPrefix('radio-group'),
        props: item.props || {},
        children: item.options.map(option => {
          return h(
            getPrefix('radio'),
            {
              props: {
                border: item.border,
                label: option.value
              }
            },
            option.text
          )
        })
      }
      return this.generateTag(tag)
    },
    // 渲染 switch
    renderSwitch(h, item) {
      let tag = {
        h,
        item,
        tagName: getPrefix('switch'),
        props: item.props || {}
      }
      return this.generateTag(tag)
    },
    // 渲染 datepicker
    renderDatePicker(h, item) {
      let tag = {
        h,
        item,
        tagName: getPrefix('date-picker'),
        props: {
          clearable: this.clearable,
          type: item.type,
          ...(item.props || {})
        }
      }
      return this.generateTag(tag)
    },
    // 渲染范围的 daterange
    renderDateRange(h, item) {
      // 处理 datetimerange 可能宽度不够的问题
      if (item.type === 'datetimerange') {
        item.width = item.width || 360
      }
      let tag = {
        h,
        item,
        tagName: getPrefix('date-picker'),
        props: {
          clearable: this.clearable,
          type: item.type,
          ...(item.props || {})
        }
      }
      return this.generateTag(tag)
    },
    renderTimePicker(h, item) {
      let tag = {
        h,
        item,
        tagName: getPrefix('time-picker'),
        props: {
          clearable: this.clearable,
          type: item.type,
          ...(item.props || {})
        }
      }
      return this.generateTag(tag)
    },
    // 渲染 cascader
    renderCascader(h, item) {
      let props = item.props || {}
      let tag = {
        h,
        item,
        tagName: getPrefix('cascader')
      }
      props.data = this.getCascaderOptions(item.options)
      tag.props = props
      return this.generateTag(tag)
    },
    // 转换 cascader options
    getCascaderOptions(options = []) {
      let list = JSON.stringify(options)
      list = list.replace(/"text":/g, '"label":')
      return JSON.parse(list)
    },
    // 生产 tag
    generateTag(tag) {
      let { h, item, tagName, props, children, on = {}, nativeOn = {} } = tag
      let currProps = {
        value: this.form[item.key],
        min: 0,
        max: 999,
        ...props,
        disabled: item.disabled || false
      }
      let attrs = item.attrs || {}
      let width = null
      let itemOn = item.on || {}
      let itemNativeOn = item.nativeOn || {}

      // 忽略这些标签的宽度设置
      let ignoreMap = {
        switch: true,
        checkbox: true,
        'checkbox-group': true,
        radio: true,
        'radio-group': true,
        'input-number': true
      }
      if (!ignoreMap[item.type]) {
        let w = item.width || this['contentWidth']
        if (typeof w === 'string' && (w.indexOf('%') >= 0 || w === 'auto')) {
          width = w
        } else {
          width = w + 'px'
        }
      }

      return h(
        tagName,
        {
          props: currProps,
          attrs,
          style: {
            width
          },
          on: {
            ...itemOn,
            input: value => {
              value = this.formatDateValue(value, item)
              this.form[item.key] = value
              this.emitInput(value, item)
            },
            ...on
          },
          nativeOn: {
            ...itemNativeOn,
            ...nativeOn
          }
        },
        children
      )
    },
    // 格式化日期返回，避免 null 的出现
    formatDateValue(value, item) {
      switch (item.type) {
        case 'date':
        case 'datetitme':
          if (!value) {
            value = ''
          }
          break
        case 'daterange':
        case 'datetimerange':
          if (!value) {
            value = ['', '']
          }
          break
      }
      return value
    },
    // 触发 item onInput 事件
    emitInput(value, item) {
      if (typeof item.onInput === 'function') {
        item.onInput(value, item, this.form)
      }
    },
    // 渲染提交 按钮
    renderSubmit(h) {
      let btns = []
      this.actions &&
        this.actions.forEach((item, index) => {
          const { content, on = () => {}, nativeOn = () => {}, ...props } = item
          btns.push(
            h(
              getPrefix('button'),
              {
                props,
                style:
                  index !== 0
                    ? {
                        'margin-left': '10px'
                      }
                    : {},
                on: {
                  click: on
                },
                nativeOn: {
                  click: nativeOn
                }
              },
              content
            )
          )
        })
      let addDefaultBtn = type => {
        let attr = {},
          text = ''
        if (this.actions && this.actions.length) {
          attr['style'] = { 'margin-left': '10px' }
        }
        if (type === 'isSubmitBtn' && this.hasSubmitBtn) {
          attr.props = {
            type: 'primary'
          }
          attr.on = {
            click: this.submit
          }
          text = this.submitText
          btns.push(h(getPrefix('button'), attr, text))
        }
        if (type === 'isResetBtn' && this.hasResetBtn) {
          this.hasSubmitBtn && (attr['style'] = { 'margin-left': '10px' })
          attr.on = {
            click: this.reset
          }
          text = this.resetText
          btns.push(h(getPrefix('button'), attr, text))
        }
      }
      addDefaultBtn('isSubmitBtn')
      addDefaultBtn('isResetBtn')
      return h(
        getPrefix('form-item'),
        {
          style: {
            display: this.inline ? 'inline-block' : 'block'
          }
        },
        btns
      )
    },
    getHypeScript() {
      return this.$parent.$createElement
    },
    renderFormList(h) {
      return this.getFormList(h)
    },
    getFormList(h) {
      return this.formList.map(item => {
        return this.getFormItem(h, item, this.getContent(h, item))
      })
    },
    getFormItem(h, item, content) {
      if (typeof item.renderLine === 'function') {
        console.log(this.form)
        return item.renderLine(this.getHypeScript(), item, this.form)
      } else {
        let settings = {
          props: {
            label: item.label,
            prop: item.key
          }
        }
        return h(
          getPrefix('form-item'),
          Object.assign(settings, item.settings),
          [content]
        )
      }
    },
    // 提交事件
    submit() {
      let $form = this.$refs.form
      $form.validate(valid => {
        this.$emit('submit', this.getForm(), valid)
      })
    },
    // 清空 form 表单
    reset() {
      this.clear()
      this.form = this.initForm()
      let $form = this.$refs.form
      $form.resetFields()
    },
    // 清空验证
    clear() {
      let $form = this.$refs.form
      $form.clearValidate && $form.clearValidate()
    },
    // 根据 key 获取 value
    getFormBykey(key) {
      return this.form[key]
    },
    // 获取整个 form
    getForm() {
      return {
        ...this.form
      }
    },
    // 设值
    setForm(form) {
      for (let key in form) {
        this.form[key] = form[key]
      }
    },
    validateField(props, callback) {
      let $form = this.$refs.form
      $form.validateField(props, callback)
    }
  }
}
</script>