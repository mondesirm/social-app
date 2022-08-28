import React, { useEffect, useState } from 'react';
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth/Auth";
import Profile from "./pages/Profile/Profile";
import { useDispatch, useSelector } from "react-redux";
import Chat from "./pages/Chat/Chat";
import { getCurrentUser, updateUser } from './actions/UserAction';

function App() {
	const user = useSelector((state) => state.authReducer.authData);
	const dispatch = useDispatch();

	useEffect(() => {
		// TODO followers don't update unless we sign out and sign back in
		const unsubscribe = () => {
			if (user?._id) dispatch(getCurrentUser(user._id));
		};

		unsubscribe();
	}, [user]);

	return (
		<div
			className="App"
			style={{
				height:
					window.location.href === "http://localhost:3000/chat"
						? "calc(100vh - 2rem)"
						: "auto",
			}}
		>
			<div className="blur" style={{ top: "-18%", right: "0" }}></div>
			<div className="blur" style={{ top: "36%", left: "-8rem" }}></div>
			<Routes>
				<Route
					path="/"
					element={user ? <Navigate to="home" /> : <Navigate to="auth" />}
				/>
				<Route
					path="/home"
					element={user ? <Home /> : <Navigate to="../auth" />}
				/>
				<Route
					path="/auth"
					element={user ? <Navigate to="../home" /> : <Auth />}
				/>
				<Route
					path="/profile/:id"
					element={user ? <Profile /> : <Navigate to="../auth" />}
				/>
				<Route
					path="*"
					element={
						<main style={{ padding: "1rem" }}>
							<p>There's nothing here!</p>
						</main>
					}
				/>

				<Route
					path="/chat"
					element={user ? <Chat /> : <Navigate to="../auth" />}
				/>
			</Routes>
		</div>
	);
}

export default App;