import React, { createContext, useContext } from 'react';

import * as realtime from 'firebase/database';

import { database } from '../utils/init-firebase';

const DatabaseContext = createContext({ database: database, ...realtime });

export const useDB = () => useContext(DatabaseContext);

export default function DatabaseContextProvider({ children }) {
	const value = { database, ...realtime };
	return (<DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>);
}