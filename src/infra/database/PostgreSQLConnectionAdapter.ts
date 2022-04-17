import Connection from "./Connection";
import pgp from "pg-promise";


export default class PostgreSQLConnectionAdapter implements Connection {
	connection: any;

	constructor () {
		this.connection = pgp()("postgres://admin:puc@2022@localhost:15432/socialbook-db");
	}

	query(stmt: string, params: any): Promise<any> {
		return this.connection.query(stmt, params);
	}

	async close(): Promise<void> {
		this.connection.$pool.end();
	}
}
