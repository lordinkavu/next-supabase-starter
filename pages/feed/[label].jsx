const parser = require("fast-xml-parser");
const he = require("he");
const labels = [{ name: "technology" }, { name: "business" }];

export default function Feed({ articles }) {
	return (
		<div>
			<ol>
				{articles.map((article) => (
					<li key={article.title + article.pubDate}>
						<a href={article.link} rel="noreferrer" target="_blank">
							{article.title}
						</a>
					</li>
				))}
			</ol>
		</div>
	);
}

export async function getStaticProps({ params }) {
	const articles = await getArticles(params.label);

	return {
		props: { articles: articles },
		revalidate: 20,
	};
}

export async function getStaticPaths() {
	const paths = labels.map((label) => ({ params: { label: label.name } }));
	return {
		paths,
		fallback: false,
	};
}

const sourceList = {
	technology: [
		{ name: "Techrunch", link: "https://techcrunch.com/feed/" },
		{ name: "WIRED", link: "https://www.wired.com/feed" },
	],
	business: [
		{
			name: "Economic Times",
			link: "https://economictimes.indiatimes.com/rssfeedsdefault.cms",
		},
		{
			name: "Business Standard",
			link: "https://www.business-standard.com/rss/home_page_top_stories.rss",
		},
	],
};

async function fetchFeed(source) {
	try {
		const articles = [];
		const response = await fetch(source.link);
		const xmlResponse = await response.text();
		const jsonResponse = parser.parse(xmlResponse, {}, true);
		const items = jsonResponse.rss.channel.item;
		items.forEach((item) => {
			const article = generateFields(item);
			if (typeTest(article)) articles.push(article);
		});

		return articles;
	} catch (e) {
		console.log(e);
		return;
	}
}

async function getArticles(label) {
	const sources = sourceList[label];
	// case where below array contains undefined needs to be handled.
	const requestPromiseArray = sources.map((source) => fetchFeed(source));
	const articles = await Promise.all(requestPromiseArray);
	return articles.flat(1);
}

function generateFields(item) {
	const article = {
		title: he.decode(item.title),
		pubDate: new Date(item.pubDate).toString(),
		link: item.link,
	};

	return article;
}

function typeTest({ title, pubDate, link }) {
	return (
		typeof title === "string" &&
		typeof pubDate === "string" &&
		typeof link === "string"
	);
}
