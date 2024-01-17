import {
  h,
  computed,
  withModifiers,
  inject,
  markRaw,
  withDirectives
} from 'vue'
import {
  selectedComp,
  globalAttrs
} from '../designerData'
import {
  isDraggable,
  dragIndex,
  dropIndex,
  useDraggable,
} from '../draggable'
import {
  parseStyle
} from '@molian/utils/css-generator'
import vCustomDirectives from '@molian/utils/useDirectives'
import { isIf, isFor, isShow, getForEachList } from '@molian/utils/useCore'

export const directives = {
  props: <any>['comp', 'index', 'modelValue'],
  setup(props: {
    modelValue: any;
    comp: {
      directives: {
        if: {
          type: string; value: boolean | any
        };
        show: {
          type: string; value: boolean | any
        };
        for: {
          value: any; data: any[]; idkey: any
        }
      };
      key: any;
      name: string | number;
      attrs: { [x: string]: any };
      id: any; css: { [x: string]: any }
    } | any;
    index: number | any
  }, {
    slots, emits
  }: any) {
    const comps: any = inject('mlComps')
    const message: any = inject('ml-message')
    const compData: any = computed({
      get() {
        return props.modelValue
      },
      set(val: any) {
        emits('update:modelValue', val)
      }
    })
    const {
      onDragStart,
      onDragenter,
      onDrop,
      onDragend,
      showToolbar
    } = useDraggable(comps, compData, message)

    // const onMouseEnter = function (evt, comp, index) {
    //   showToolbar(evt, comp, index, props.modelValue.value)
    // }

    const onClick = function (evt: any, comp: null, index: null) {
      try {
        if (evt.e) {
          evt.e.stopPropagation()
        } else {
          evt.stopPropagation()
        }
      } catch (e) {
        console.log(e)
      }
      selectedComp.value = props.comp
      showToolbar(evt, comp, index, props.modelValue)
    }

    const computedClass = computed(() => {
      return {
        'designer-comp': true,
        'hiddenComps': dragIndex.value === props.index,
        'is-margin': dropIndex.value === props.index && isDraggable.value,
        'selectedComp': selectedComp && selectedComp.value && selectedComp.value.key === props.comp.key
      }
    })

    const variable = computed(() => {
      return globalAttrs.variable
  })

    // 自定义指令支持
    const currentTag = comps.value[props.comp.name].comp ? markRaw(comps.value[props.comp.name].comp) : comps.value[props.comp.name].name
    const renderDom: any = (domForAttr: { row?: any; index?: any; keyProps?: any; type?: any }) => {
      const { row, index, keyProps, type } = domForAttr
      // props
      const propsData: any = {}
      for (const key in props.comp.attrs) {
        if (Object.hasOwnProperty.call(props.comp.attrs, key)) {
          const element = props.comp.attrs[key];
          propsData[key] = element.value
        }
      }
      const attrObj = {
        id: props.comp.id,
        ['data-key']: props.comp.key,
        style: { ...parseStyle(props.comp.css, props.comp.key), ...!isShow(props.comp) && { display: 'none' } || {} },
        ...propsData,
        // onMouseenter: withModifiers(($event) => onMouseEnter($event, props.comp, props.index), ['self', 'native']), // 暂且取消经过选择
        onClick: withModifiers(($event: any) => onClick($event, props.comp, props.index), ['native']),
        onDragstart: withModifiers((evt: any) => onDragStart(evt, props.comp), ['self', 'prevent']),
        onDragend: onDragend,
        onDragover: withModifiers((evt: any) => onDragenter(props.index, props.comp), ['self', 'prevent']),
        onDrop: withModifiers(($event: any) => onDrop($event, null, null), ['self', 'stop']),
        class: computedClass.value,
      }
      if (index >= 0) {
        attrObj.key = keyProps.idKey && row[keyProps.idKey] || index || null
      }
      const nowSlots: {
        [key: string]: any;
      } = {}
      for (const key in slots) {
        if (Object.hasOwnProperty.call(slots, key)) {
          const value = slots[key];
          if (keyProps) {
            const obj: any = {}
            if (!!keyProps['dataKey']) {
              if (type === 'object') {
                obj[keyProps['dataKey']] = row.value
              } else {
                obj[keyProps['dataKey']] = row
              }
            }
            if (!!keyProps['objectKey'] && type === 'object') {
              obj[keyProps['objectKey']] = row.key
            }
            if (!!keyProps['indexKey'] && !!keyProps['dataKey']) {
              obj[keyProps['indexKey']] = index
            }
            nowSlots[key] = value(obj)
          } else {
            nowSlots[key] = value({
              row,
              index
            })
          }
        }
      }
      if (typeof currentTag === 'string') {
        return withDirectives(h('div', attrObj, nowSlots.default),[[vCustomDirectives, props.comp]])
      } else {
        return withDirectives(h(currentTag, attrObj, nowSlots), [[vCustomDirectives, props.comp]])
      }
    }
    let newForEachList = computed(()=>{
      return getForEachList(props.comp, variable)
    })
    return () => [
      isFor(props.comp) && newForEachList.value.data.map((row: any, index: any) => {
        return renderDom({
          row,
          index,
          keyProps: props.comp.directives.for,
          type: newForEachList.value.type
        })
      }) || isIf(props.comp) && renderDom({}) || null
    ]
  }
}
