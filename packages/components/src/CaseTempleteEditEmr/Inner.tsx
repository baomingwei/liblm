import { mchcEnv, mchcLogger } from "@lm_fe/env";
import { load_src, sleep } from "@lm_fe/utils";
import { Button, message, Space } from 'antd';
import React, { useEffect, useRef } from 'react';
import { ICaseEditProps } from "src/CaseTempleteEdit/types";
import { IFuck_Xemr } from "./types";
import { get_editor_frame, load_xemr } from "./utils";



export default function CaseTempleteEditEmr(props: ICaseEditProps) {
  const {
    toolbars,
    // value = demo_text,
    value = '',
    onChange,
    containerProps,
    hidentoolbars,
  } = props;

  const fuck_editor = useRef<IFuck_Xemr>()
  const value_cache = useRef(value)
  value_cache.current = value

  useEffect(() => {

    load_xemr()
      .then(editor => {
        fuck_editor.current = editor

        mchcLogger.log('fuck_editor', fuck_editor.current)
        init_emr()
      })

    return () => {

    }
  }, [])
  useEffect(() => {
    try {
      fuck_editor.current?.loadHtml(value);
    } catch (e) {
      message.warning('加载文档发生错误')
      mchcLogger.warn('加载文档发生错误', { e, value })
    }


    return () => {

    }
  }, [value])




  function init_emr() {
    if (!fuck_editor.current) {
      return;
    }

    let option = {
      license:
        'xxxxx', //授权字符串
      baseUrl: mchcEnv.gs(_ => _.lm_libs["X-EMR"]["/"]), //基本URL
      saveUrl: '/doc/', //保存URL
      pdfUrl: 'https://www.x-emr.cn/pdf/post', //pdf生成服务
      mode: emr_mode, //form:表单模式，design:设计模式
      scale: 1, //缩放比例
      container: '#editor_el', //编辑器容器对象ID
      toolbar: {
        file: true, //显示文件
        edit: true, //显示编辑
        insert: true, //显示插入
        expression: true, //显示表达式
        table: true, //显示表格
        revision: true, //显示修订
        view: false, //显示查看
        print: false, //显示打印
        import: false, //显示导入
        export: false, //显示导出
        develop: false, //显示开发工具
        help: false, //显示帮助
      },
      statusbar: false, //是否显示状态栏
      dictionary: false && [
        //知识库
      ],
    };
    fuck_editor.current.init(option);


    fuck_editor.current.loadHtml(value_cache.current);

    let _emreditor = get_editor_frame()
    load_src({
      type: 'text/css',
      text: `
            body {
              background-image: none !important;
          }
      `},
      _emreditor?.contentWindow?.document.head
    )



    if (!value_cache.current)
      fuck_editor.current.execCommand('new')
  };


  async function save() {
    try {
      // 将文书的预览内容存起来
      const _pv = await prepare_preview()

      let documentElement = _pv?.contentWindow?.document!

      let previewHTML = documentElement.querySelector('.preview')?.innerHTML ?? ''
      mchcLogger.log('previewHTML', { previewHTML }, fuck_editor.current?.getHtml())
      onChange?.(fuck_editor.current?.getHtml()!);
    } catch (e) {
      mchcEnv.warning('发生错误')
      mchcLogger.warn('发生错误', e)
    }

  };






  const { hiddenButton, emr_mode = 'design' } = props;
  async function prepare_preview() {
    if (!fuck_editor.current) return
    fuck_editor.current.execCommand('preview')
    await sleep(1000)
    // let _emr_el = get_editor_frame()

    let _pv = document.getElementById('_printview') as HTMLIFrameElement
    let doc_el = _pv?.contentDocument!
    doc_el.querySelectorAll('text').forEach(element => element.remove()); // 删除该死的授权许可
    doc_el.querySelectorAll('.page-mask').forEach(element => element.remove()); // 删除该死的mask
    doc_el.querySelectorAll('.pagebreaker').forEach(element => element.remove()); // 删除该死的pagebreaker
    // _pv.hidden = true
    // _emr_el.style.display = 'block'

    return _pv
  }


  async function print() {
    try {
      const _pv = await prepare_preview()
      _pv?.contentWindow?.print()
    } catch (e) {
      mchcEnv.warning('发生错误')
      mchcLogger.warn('发生错误', e)
    }
    // let previewHTML = documentElement.querySelector('.preview')?.innerHTML
    // onChange && onChange(value, previewHTML);
  }
  return (
    <>
      <div id="editor_el" style={{ overflow: 'hidden auto', height: '100%', ...containerProps }}></div>
      {!hiddenButton && (
        <Space.Compact style={{ position: 'fixed', right: 36, bottom: 36 }}>
          <Button
            type="primary"
            onClick={save}
          >
            保存
          </Button>
          <Button
            type="primary"
            onClick={print}
          >
            打印
          </Button>
        </Space.Compact>
      )}
    </>
  );

}
