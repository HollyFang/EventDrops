import uniqBy from 'lodash.uniqby';

const filterOverlappingDrop = (xScale, dropDate) => d =>
    uniqBy(d.data, data => Math.round(xScale(dropDate(data))));

export default (config, xScale) => selection => {
    const {
        drop: {
            color: dropColor,
            radius: dropRadius,
            date: dropDate,
            shapeFunc: shapeFunc,
            onClick,
            onMouseOver,
            onMouseOut,
        },
    } = config;

    const drops = selection
        .selectAll('.drop')
        .data(filterOverlappingDrop(xScale, dropDate));

    if (shapeFunc)
        drops
            .enter()
            .append('path')
            .classed('drop', true)
            .on('click', onClick)
            .on('mouseover', onMouseOver)
            .on('mouseout', onMouseOut)
            .merge(drops)
            .attr('d', d => shapeFunc(xScale, d, dropRadius))
            .attr('fill', dropColor)
            .attr('stroke', '#000')
            .attr('stroke-width', 1);
    else
        drops
            .enter()
            .append('circle')
            .classed('drop', true)
            .on('click', onClick)
            .on('mouseover', onMouseOver)
            .on('mouseout', onMouseOut)
            .merge(drops)
            .attr('r', dropRadius)
            .attr('fill', dropColor)
            .attr('cx', d => xScale(dropDate(d)));
    drops
        .exit()
        .on('click', null)
        .on('mouseover', null)
        .on('mouseout', null)
        .remove();
};
