export const onlyTextLayout = {
    lg: [{i: '1', w: 12, h:4, x:0, y:0}],
    md: [{i: '1', w: 12, h: 4, x:0, y:0}],
    sm: [{i: '1', w: 12, h: 4, x:0, y:0}],
    xs: [{i: '1', w: 12, h: 4, x:0, y:0}],
    xxs: [{i: '1', w: 12, h: 4, x:0, y:0}]
}

export const sideBySideLayout = {
    lg: [{i: '1', w: 6, h: 4, x: 0, y: 0, minW: 2, minH: 3},
        {i: '2', w: 6, h: 4, x: 6, y: 0, minW: 4, minH: 3}],
    md: [{i: '1', w: 5, h: 4, x: 0, y: 0, minW: 2, minH: 3},
        {i: '2', w: 5, h: 4, x: 1, y: 0, minW: 4, minH: 3}],
    sm: [{i: '1', w: 6, h: 4, x: 0, y: 0, minW: 2, minH: 3},
        {i: '2', w: 6, h: 4, x: 6, y: 0, minW: 4, minH: 3}],
    xs: [{i: '1', w: 6, h: 4, x: 0, y: 0, minW: 2, minH: 3},
        {i: '2', w: 6, h: 4, x: 6, y: 0, minW: 4, minH: 3}],
    xxs: [{i: '1', w: 6, h: 4, x: 0, y: 0, minW: 2, minH: 3},
        {i: '2', w: 6, h: 4, x: 6, y: 0, minW: 4, minH: 3}]
}

export const fullWidthLayout = setLarge([{i: '1', w: 12, h: 4, x: 0, y: 0},
    {i: '2', w: 12, h: 4, x: 0, y: 4}], sideBySideLayout)

function setLarge(lgVal, dic) {
    let returnVal = structuredClone(dic)
    returnVal.lg = lgVal
    return returnVal
}