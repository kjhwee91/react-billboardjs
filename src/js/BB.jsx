import {bb} from "billboard.js";
import React, {PropTypes} from "react";
import connect from 'react-watcher';
import {deepCopy} from './util';

class BB extends React.Component {

	static get displayName() {
		return "BB";
	}

	// 마운트 직전 한번
	componentWillMount() {
		this.instance = null;
		this.watchConfig();
	}

	watchConfig() {
		const { watch } = this.props;

		watch('axis.x.labels', (data) => this.instance.axis.label({x : data}));
		watch('axis.y.labels', (data) => this.instance.axis.label({y : data}));
		watch('axis.x.categories', (data) => this.instance.axis.x.categories(data));
		watch('legend.show', (data) => this.instance.legend.show(data));
		watch('legend.hide', (data) => this.instance.legend.hide(data));
		watch('regions', (data) => this.instance.regions(data));
		watch('size.width', (data) => this.instance.resize({ width : data}));
		watch('size.height', (data) => this.instance.resize({ height : data}));
		watch('grid.x.lines', (data) => this.instance.xgrids(data));
		watch('grid.y.lines', (data) => this.instance.ygrids(data));
		watch('zoom.enable', (data) => this.instance.zoom.enable(data));

		// using custom
		watch('zoom.domain', (data) => {
			if(data === null){
				this.instance.unzoom();
			} else {
				this.instance.zoom();
			}
		});

		watch("interaction", (data) => {
			this.destroy();
		});

		// TODO
		// watch('data', (data) => this.instance.load(data));
		// watch('data', (data) => this.instance.unload(data));
		// watch('data.hide', (data) => this.instance.hide(data));
		// watch('data.hide', (data) => this.instance.show(data));
		// watch('data.groups', (data) => this.instance.groups(data));
		// watch('data.type', (data) => this.instance.transform(data));
	}

	// 마운트 직후 한번
	componentDidMount() {
		this.generateChart();
	}

	// 업데이트 직전
	componentWillReceiveProps(newProps) {

	}

	// state, props 업데이트 직전의 직전
	shouldComponentUpdate(nextProps, nextState) {
		if(this.instance){
			return false;
		} else {
			return true;
		}
	}

	// 업데이트 직전
	componentWillUpdate() {

	}

	// 업데이트 직후
	componentDidUpdate() {
		this.generateChart();
	}

	// 언마운트 직전 한번
	componentWillUnmount() {
		this.destroy();
	}

	renewal() {
		this.generateChart();
	}

	destroy() {
		try {
			this.instance && this.instance.destroy();
			this.instance = null;
		} catch (err) {
			throw new Error("Internal BB error", err);
		}
	}

	generateChart(mountNode = this.wrapper, config = this.props) {
		// using react node

		const newConfig = deepCopy({}, config);
		newConfig.bindto = mountNode;

		if(this.instance){
			this.instance.destroy();
		}
		this.instance = bb.generate(newConfig);
		window.chart = this.instance;
	}

	render() {
		return (<div
			key={this.props.id}
			ref={(d) => {this.wrapper = d;}}
		/>);
	}
}

BB.propTypes = {
	size : PropTypes.object,
	padding: PropTypes.object,
	color: PropTypes.object,
	interaction: PropTypes.object,
	transition: PropTypes.object,
	oninit: PropTypes.func,
	onrendered: PropTypes.func,
	onmouseover: PropTypes.func,
	onmouseout: PropTypes.func,
	onresize: PropTypes.func,
	onresized: PropTypes.func,
	axis: PropTypes.object,
	grid: PropTypes.object,
	regions: PropTypes.array,
	legend: PropTypes.object,
	tooltip: PropTypes.object,
	subchart: PropTypes.object,
	zoom: PropTypes.object,
	point: PropTypes.object,
	line: PropTypes.object,
	area: PropTypes.object,
	bar: PropTypes.object,
	pie: PropTypes.object,
	donut: PropTypes.object,
	gauge: PropTypes.object,
	data : PropTypes.object,
	title: PropTypes.object,
	className: PropTypes.string,
	style: PropTypes.object,
	unloadBeforeLoad: PropTypes.bool
};

export default connect(BB);
export {
	BB
};