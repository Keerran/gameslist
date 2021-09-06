import Document, {Html, Head, Main, NextScript} from "next/document";

class AppDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
                          rel="stylesheet"/>

                    <link href="https://fonts.googleapis.com/css2?family=Overpass:wght@400;600&display=swap"
                          rel="stylesheet"/>
                </Head>
                <body className="dark">
                <Main/>
                <NextScript/>
                </body>
            </Html>
        );
    }
}

export default AppDocument;