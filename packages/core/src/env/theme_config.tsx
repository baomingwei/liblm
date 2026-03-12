import { assign, shake } from "@lm_fe/utils";

import { THEME } from '@lm_fe/provoke';
import { MappingAlgorithm, theme } from 'antd';

import { ThemeConfig } from 'antd';

export function theme_config(sys_theme: THEME) {
    const {
        colorPrimary,
        colorBorder,
        darkTheme,
        compact,
        fontSize,
        cus_fontBold,
        bg_color,
        colors,
        colorTextDisabled,
        colorTextPlaceholder,
        colorBgContainerDisabled,
        labelColor,
        rowHoverBg,
        labelFontSize
    } = sys_theme

    const algorithm: MappingAlgorithm[] = []
    if (cus_fontBold) {
        import('./index.less')
    }
    if (darkTheme) {
        algorithm.push(theme.darkAlgorithm)
    }
    if (compact) {
        algorithm.push(theme.compactAlgorithm)
    }

    const conf: ThemeConfig = {

        token: {

            colorPrimary,

        },
        components: {
            Input: {
            },
            Message: {

            },
            Card: {
            },
            Tabs: {
                horizontalMargin: compact ? '0 0 6px 0' : '0 0 12px 0',
                verticalItemPadding: compact ? '2px 6px' : '4px 12px',

            },
            Button: {
                colorLink: colorPrimary
            },
            Form: {
                itemMarginBottom: compact ? 4 : 8,
            },
            Table: {
                cellPaddingBlock: 4,
                cellPaddingBlockMD: 4,
                cellPaddingBlockSM: 4,
                cellPaddingInline: 2,
                cellPaddingInlineMD: 2,
                cellPaddingInlineSM: 2,
                // cellPaddingBlock: compact ? 2 : 4,
                // cellPaddingBlockMD: compact ? 2 : 4,
                // cellPaddingBlockSM: compact ? 2 : 4,
                // cellPaddingInline: compact ? 2 : 4,
                // cellPaddingInlineMD: compact ? 2 : 4,
                // cellPaddingInlineSM: compact ? 2 : 4,
                headerBg: darkTheme ? bg_color : '#eee',
            },
            Segmented: {
                itemSelectedBg: colors?.light[1],
                // itemSelectedColor: '#fff',
                trackBg: colors?.light[0]
                // itemSelectedBg: colors?.light[0],
                // trackBg: colorPrimary,
            },
            Layout: {
                headerBg: darkTheme ? undefined : colorPrimary
            },
        },
        algorithm

    }
    conf.token = safe_extend(conf.token, { colorTextDisabled, colorBgContainerDisabled, colorTextPlaceholder, colorBorder, fontSize })
    conf.components!.Table = safe_extend(conf.components?.Table, { borderColor: colorBorder, rowHoverBg })
    conf.components!.Form = safe_extend(conf.components?.Form, { labelColor, labelFontSize })
    return conf
}
function safe_extend<T extends object>(src?: T, target?: T,) {
    if (!src) return target
    if (!target) return src
    return assign(src, shake(target))
}