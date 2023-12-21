import {
  cloudUrl,
  uiMapping
} from './defaultData'
import {
  getAll,
  add
} from './indexedDB'
import {
  slotsMap,
  currentRegComps
} from './compsConfig'

import {
  langObj,
  language
} from './lang'
export async function getCloudData(comps) {
  // 首先获取正在使用的组件库名
  const {
    current,
    data
  } = uiMapping
  //其次获取已有的本地数据
  const localData = await getAll(current)
  // 比对已有数据找出需云端获取的数据
  const prefixObj = data.find(item => {
    return item.name === current
  })
  const nowData = {}
  if (prefixObj) {
    const currentDBData = Object.keys(comps).reduce((result, item) => {
      if (item.indexOf(prefixObj.prefix) === 0) {
        result.push({
          name: item,
          component: comps[item]
        })
      }
      return result
    }, [])
    // 查询i18n slots attrs中缺少的数据
    const pendingData = []
    localData.forEach(localItem => {
      const data = currentDBData.filter(item => {
        return localItem.data.findIndex(fItem => fItem.key === item.name)
      }).map(item => {
        const {
          name,
          emits,
          slots,
          updateModel,
          props
        } = item.component
        return {
          name,
          emits,
          slots,
          updateModel,
          props
        }
      })
      if (data.length > 0) {
        if (localItem.type === 'slots') {
          if (localItem.data.length === 0) {
            pendingData.push({
              type: localItem.type,
              data: data.map(item => {
                return item.name
              })
            })
          } else {
            nowData[localItem.type] = localItem.data
          }
        } else if (localItem.type === 'attrs') {
          if (localItem.data.length === 0) {
            pendingData.push({
              type: localItem.type,
              data: data.map(item => {
                return {
                  tag: item.name,
                  attrs: item.props
                }
              })
            })
          } else {
            nowData[localItem.type] = localItem.data
          }
        } else if (localItem.type === 'i18n') {
          if (localItem.data.length === 0) {
            pendingData.push({
              type: localItem.type,
              data: data.map(item => {
                return {
                  tag: item.name,
                  attrs: Object.keys(item.props).map(item => {
                    return item
                  })
                }
              })
            })
          } else {
            nowData[localItem.type] = localItem.data
          }
        }
      }
    })
    // 请求云端数据
    if (pendingData.length > 0) {
      const res = await fetch(cloudUrl, {
        method: 'post',
        body: JSON.stringify({
          UIName: current,
          lang: language.value,
          data: pendingData
        })
      })
      // 将云端数据写入本地数据中
      const cloudData = await res.json()
      if (cloudData.code === 0) {
        cloudData.data.forEach(item => {
          item.data.forEach(fitem => {
            add(item.type, {
              key: fitem.tag,
              value: fitem.data,
              UIName: current
            }).then(res => {
              //console.log(res)
            })
          })
          nowData[item.type] = item.data.map(mItem => {
            return {
              key: mItem.tag,
              value: mItem.data,
              UIName: current
            }
          })
        })
      }
    }
    // 初始化项目
    for (const key in nowData) {
      if (Object.hasOwnProperty.call(nowData, key)) {
        const element = nowData[key];
        if (key === 'slots') {
          element.forEach(item => {
            if (!slotsMap.value[item.key]) {
              slotsMap.value[item.key] = item.value
            }
          })
        } else if (key === 'attrs') {
          element.forEach(item => {
            const compEl = currentRegComps.value[item.key]
            for (const key in item.value) {
              if (Object.hasOwnProperty.call(item.value, key)) {
                const prop = item.value[key];
                compEl.props[key] = {
                  ...prop,
                  ...compEl.props[key]
                }
              }
            }
          })
        } else if (key === 'i18n') {
          element.forEach(item => {
            for (const langKey in item.value[language.value]) {
              if (Object.hasOwnProperty.call(item.value[language.value], langKey)) {
                const langText = item.value[language.value][langKey];
                const langPath = `attrs.${item.key}.${langKey}`
                if (!langObj.value[langPath]) {
                  langObj.value[langPath] = langText
                }
              }
            }
          })
        }
      }
    }
  }
}