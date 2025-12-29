import {defineConfig, presetUno, presetIcons, presetAttributify} from 'unocss'

export default defineConfig({
    presets: [
        // 启用 UnoCSS 核心预设
        presetUno(),
        presetIcons({
            scale: 1.2,
            warn: true,
            extraProperties: {
                'display': 'inline-block',
                'vertical-align': 'middle',
            },
            collections: {}
        }),
    ],

    rules: [
        // 自定义 vw 单位
        [/^h-(\d+)vw$/, ([_, d]) => ({height: `${d}vw`})],
        [/^w-(\d+)vw$/, ([_, d]) => ({width: `${d}vw`})],
        [/^h-(\d+)px$/, ([_, d]) => ({height: `${d}px`})],
        [/^w-(\d+)px$/, ([_, d]) => ({width: `${d}px`})],
        [/^text-(\d+\.?\d*)vw$/, ([_, d]) => ({'font-size': `${d}vw`})],
        [/^p-(\d+)vw$/, ([_, d]) => ({padding: `${d}vw`})],
        [/^m-(\d+)vw$/, ([_, d]) => ({margin: `${d}vw`})],
        [/^pt-(\d+)vw$/, ([_, d]) => ({'padding-top': `${d}vw`})],
        [/^pb-(\d+)vw$/, ([_, d]) => ({'padding-bottom': `${d}vw`})],
        [/^pl-(\d+)vw$/, ([_, d]) => ({'padding-left': `${d}vw`})],
        [/^pr-(\d+)vw$/, ([_, d]) => ({'padding-right': `${d}vw`})],
        [/^mt-(\d+)vw$/, ([_, d]) => ({'margin-top': `${d}vw`})],
        [/^mb-(\d+)vw$/, ([_, d]) => ({'margin-bottom': `${d}vw`})],
        [/^ml-(\d+)vw$/, ([_, d]) => ({'margin-left': `${d}vw`})],
        [/^mr-(\d+)vw$/, ([_, d]) => ({'margin-right': `${d}vw`})],
        [/^rounded-(\d+)px$/, ([_, d]) => ({'border-radius': `${d}px`})],
        [/^rounded-(\d+)vw$/, ([_, d]) => ({'border-radius': `${d}vw`})],
        [/^gap-(\d+)vw$/, ([_, d]) => ({gap: `${d}vw`})],
        [/^top-(\d+)vw$/, ([_, d]) => ({top: `${d}vw`})],
        [/^left-(\d+)vw$/, ([_, d]) => ({left: `${d}vw`})],
        [/^right-(\d+)vw$/, ([_, d]) => ({right: `${d}vw`})],
        [/^bottom-(\d+)vw$/, ([_, d]) => ({bottom: `${d}vw`})],
        [/^shadow-(\w+)$/, ([_, type]) => {
            const shadows = {
                'sm': '0 1px 2px 0 rgba(0,0,0,0.05)',
                'md': '0 4px 6px -1px rgba(0,0,0,0.1)',
                'lg': '0 10px 15px -3px rgba(0,0,0,0.1)'
            }
            return {'box-shadow': shadows[type] || shadows['sm']}
        }]
    ],

    shortcuts: [
        // 布局
        ['flex-center', 'flex justify-center items-center'],
        ['flex-col-center', 'flex flex-col justify-center items-center'],
        ['flex-between', 'flex justify-between items-center'],

        // 颜色快捷方式
        ['bg-primary', 'bg-[#0097ff]'],
        ['bg-secondary', 'bg-[#ff6600]'],
        ['text-primary', 'text-[#0097ff]'],
        ['text-secondary', 'text-[#ff6600]'],
        ['text-gray-200', 'text-[#eeeeee]'],
        ['text-gray-300', 'text-[#cccccc]'],
        ['text-gray-400', 'text-[#aaaaaa]'],
        ['text-gray-500', 'text-[#888888]'],
        ['text-gray-600', 'text-[#666666]'],
        ['text-gray-700', 'text-[#555555]'],
        ['text-gray-800', 'text-[#333333]'],

        // 背景色
        ['bg-gray-100', 'bg-[#f5f5f5]'],
        ['bg-gray-200', 'bg-[#eeeeee]'],
        ['bg-yellow-100', 'bg-[#feedc1]'],

        // 边框
        ['border-b-1px', 'border-b border-solid border-gray-200'],
        ['border-t-1px', 'border-t border-solid border-gray-200'],

        ['button-primary', 'bg-[#38ca73] text-white text-3.8vw font-bold rounded-1vw py-2.5vw px-0 w-full border-none outline-none hover:bg-green-600'],
        ['button-secondary', 'bg-[#eee] text-gray-600 text-3.8vw font-bold rounded-1vw py-2.5vw px-0 w-full border-none outline-none hover:bg-gray-200'],
        ['form-input', 'border-none outline-none w-full h-4vw text-3vw'],
        ['header-primary', 'w-full h-12vw bg-primary text-white text-4.8vw flex-center fixed left-0 top-0 z-1000'],
        ['card-container', 'w-95% mx-auto my-2vw rounded-2vw p-3vw bg-white shadow-sm'],
        ['flex-between', 'flex justify-between items-center'],
        ['flex-start', 'flex justify-start items-center'],
    ],

    theme: {
        colors: {
            'primary': '#0097ff',
            'secondary': '#ff6600',
            'gray-100': '#f5f5f5',
            'gray-200': '#eeeeee',
            'gray-300': '#cccccc',
            'gray-400': '#aaaaaa',
            'gray-500': '#888888',
            'gray-600': '#666666',
            'gray-700': '#555555',
            'gray-800': '#333333',
        }
    },

    safelist: [
        // 布局
        'flex', 'flex-col', 'flex-wrap', 'items-center', 'justify-center', 'justify-between', 'justify-around',
        // 尺寸
        'w-full', 'h-full', 'w-95%', 'w-90%',
        // 边距
        'mx-auto', 'my-auto',
        // 颜色
        'text-white', 'bg-white',
        // 位置
        'fixed', 'static',
    ],
    variants: [],
})