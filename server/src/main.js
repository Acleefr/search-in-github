import { launch } from "./server";
import 'dotenv/config'

const { PORT = 4242 } = process.env;
launch(PORT);
