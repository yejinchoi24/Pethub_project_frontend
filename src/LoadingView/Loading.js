import React from 'react';
import './Loading.css';
import Spinner from './loading_spinner.gif';
import "../HomeView/Home.css";

const Loading = () => {
	return (
		<div className='app-container'>
			<div className="loading-container">
				<p className="loading-text">잠시만 기다려 주세요.</p>
				<img src={Spinner} alt="로딩중" width="10%" />
			</div>
		</div>
	);
};

export default Loading;
