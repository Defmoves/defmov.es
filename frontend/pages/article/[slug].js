import ReactMarkdown from "react-markdown";
import Moment from "react-moment";
import { fetchAPI } from "../../lib/api";
import Layout from "../../components/layout";
import Image from "../../components/image";
import Seo from "../../components/seo";
import { getStrapiMedia } from "../../lib/media";

const Article = ({ article, categories }) => {
  const imageUrl = getStrapiMedia(article.image);

  const seo = {
    metaTitle: article.title,
    metaDescription: article.description,
    shareImage: article.image,
    article: true,
  };

  console.log(article);

  return (
    <Layout categories={categories}>
      <Seo seo={seo} />
      <div
        id="banner"
        className="uk-height-medium uk-flex uk-flex-center uk-flex-bottom uk-background-cover uk-light "
        data-src={imageUrl}
        data-srcset={imageUrl}
        data-uk-img
      >
        <h1>{article.title}</h1>
        <div id="bar" />
      </div>
      <div className="uk-section">
        <div className="uk-container uk-container-small">
          <h3>{article.description}</h3>
          <ReactMarkdown children={article.content} escapeHtml={false} />
          <hr className="uk-divider-small" />
          <div className="uk-grid-small uk-flex-left" data-uk-grid="true">
            <div>
              {article.author.picture && (
                <Image
                  image={article.author.picture}
                  style={{
                    position: "static",
                    borderRadius: "50%",
                    height: 30,
                  }}
                />
              )}
            </div>
            <div className="uk-width-expand">
              <p className="uk-margin-remove-bottom">
                By {article.author.name}
              </p>
              <p className="uk-text-meta uk-margin-remove-top">
                <Moment format="MMM Do YYYY">{article.publishedAt}</Moment>
              </p>
              <p className="uk-text-meta">
                Image By:{" "}
                <a href={article.creditHref} target="_blank">
                  {article.creditSource}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export async function getStaticPaths() {
  const articles = await fetchAPI("/articles");

  return {
    paths: articles.map((article) => ({
      params: {
        slug: article.slug,
      },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const articles = await fetchAPI(
    `/articles?slug=${params.slug}&status=published`
  );
  const categories = await fetchAPI("/categories");

  return {
    props: { article: articles[0], categories },
    revalidate: 1,
  };
}

export default Article;
