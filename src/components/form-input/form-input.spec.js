import Input from './form-input'
import { mount } from '@vue/test-utils'

describe('form-input', async () => {
  it('emits an input event', async () => {
    const wrapper = mount(Input)

    const input = wrapper.find('input')
    input.element.value = 'test'
    input.trigger('input')

    expect(wrapper.emitted().input[0]).toEqual(['test'])
  })

  it('emits a native focus event', async () => {
    const spy = jest.fn()
    const wrapper = mount(Input, {
      listeners: {
        focus: spy
      }
    })
    const input = wrapper.find('input')
    input.trigger('focus')

    expect(wrapper.emitted()).toMatchObject({})
    expect(spy).toHaveBeenCalled()
  })

  it('emits a native blur event', async () => {
    const spy = jest.fn()
    const wrapper = mount(Input, {
      listeners: {
        blur: spy
      }
    })
    const input = wrapper.find('input')
    input.trigger('blur')

    expect(wrapper.emitted()).toMatchObject({})
    expect(spy).toHaveBeenCalled()
  })

  it('apply transform function', async () => {
    const wrapper = mount(Input, {
      propsData: {
        formatter (value) {
          return value.toLowerCase()
        }
      }
    })
    const input = wrapper.find('input')
    input.element.value = 'TEST'
    input.trigger('input')

    expect(wrapper.emitted().input[0]).toEqual(['test'])
  })

  it('lazy apply transform function', async () => {
    const wrapper = mount(Input, {
      propsData: {
        formatter (value) {
          return value.toLowerCase()
        },
        lazyFormatter: true
      }
    })
    const input = wrapper.find('input')
    input.element.value = 'TEST'
    input.trigger('input')
    expect(wrapper.emitted().input[0]).not.toEqual(['test'])

    input.trigger('change')
    expect(wrapper.emitted().change[0]).toEqual(['test'])
  })

  it('focused number inout with no-wheel set to true works', async () => {
    const spy = jest.fn()
    const wrapper = mount(Input, {
      propsData: {
        noWheel: true,
        type: 'number',
        value: '123'
      },
      listeners: {
        blur: spy
      },
      attachToDocument: true
    })
    const input = wrapper.find('input')

    expect(input.element.type).toBe('number')
    expect(wrapper.props().noWheel).toBe(true)

    input.element.focus()
    input.trigger('wheel', { deltaY: 33.33, deltaX: 0, deltaZ: 0, deltaMode: 0 })

    // no-wheel=true will fire a blur event on the input
    expect(spy).toHaveBeenCalled()
  })

  it('focused number inout with no-wheel set to false works', async () => {
    const spy = jest.fn(() => {})
    const wrapper = mount(Input, {
      propsData: {
        noWheel: false,
        type: 'number',
        value: '123'
      },
      listeners: {
        blur: spy
      },
      attachToDocument: true
    })
    const input = wrapper.find('input')

    expect(input.element.type).toBe('number')
    expect(wrapper.props().noWheel).toBe(false)

    input.element.focus()
    input.trigger('wheel', { deltaY: 33.33, deltaX: 0, deltaZ: 0, deltaMode: 0 })

    // no-wheel=false will not fire a blur event on the input
    expect(spy).not.toHaveBeenCalled()
  })
})
