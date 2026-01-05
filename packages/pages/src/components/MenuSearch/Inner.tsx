import { mchcMacro } from '@lm_fe/env';
import { Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { mchcModal__ } from 'src/modals';
import { Permission_With_Children, use_perm_tree } from '../Layout_Sider/utils';
interface IProps {
    onSelect(item: any): void
}
const styles: React.CSSProperties = { border: '1px solid #ccc', color: '#ccc', fontFamily: 'Arial', fontSize: '90%', borderBottomWidth: 2, margin: '0 2px', borderRadius: 2, minWidth: 20, minHeight: 20, padding: '0 2px', lineHeight: '20px', textAlign: 'center', display: 'inline-block' }
const id = 'MenuSearch'.split('').reduce((sum, a) => sum + a.charCodeAt(0), 0)
export default function MenuSearch_Inner(props: IProps) {
    const { onSelect } = props;
    const { permissions_tree, toggle_collapsed } = use_perm_tree()
    const [menus, set_menus] = useState((make_tag(permissions_tree)))
    function make_tag(tree: Permission_With_Children[] = []) {
        return tree
            .reduce(
                (sum, a) => [...sum, ...(a.children ?? []).reduce((cSum, c) => [...cSum, ...(c.type === 'menu' ? [{ ...c, name: `${a.name} - ${c.name}` }] : [])], [])],
                [])
    }
    useEffect(() => {

        set_menus(make_tag(permissions_tree))
        return () => {

        }
    }, [permissions_tree])

    function open() {
        mchcModal__.openOne(id, 'text_search', {
            modal_data: {
                items: menus,
                getLabel(target) {
                    return target.name
                },
                onSelect(target) {
                    onSelect(target)
                }
            }
        })
    }
    const suffix = (
        <span onClick={open} style={{ cursor: 'pointer' }}>
            <kbd style={styles}>Ctrl</kbd>
            <kbd style={styles}>P</kbd>
        </span>
    );
    useEffect(() => {
        const keydownCb = function (event: KeyboardEvent) {
            // event 参数的类型为 KeyboardEvent
            // event.preventDefault();
            if (event.ctrlKey) {
                if (event.key === 'p') {
                    event.preventDefault()
                    open()
                }
                if (event.key === 'b') {
                    event.preventDefault()
                    toggle_collapsed()
                }
            }
        }

        window.addEventListener("keydown", keydownCb);

        return () => {
            window.removeEventListener("keydown", keydownCb);
        }
    }, [])

    return (
        <div style={{}} >
            <Input suffix={suffix} placeholder={mchcMacro.LM_BUILD_AT} onClick={open} />
        </div>

    );
};
