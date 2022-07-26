import React from "react";

class Pagination extends React.Component {
  render() {
    const { articlesCount, articlesPerPage, activeIndex } = this.props;
    let noOfPages = Math.ceil(articlesCount / articlesPerPage);
    let pageArr = [];
    for (let i = 1; i <= noOfPages; i++) {
      pageArr.push(i);
    }
    return (
      <section className="pagination">
        <div className="container">
          <p
            onClick={() => {
              this.props.updatePage(activeIndex - 1 < 1 ? 1 : activeIndex - 1);
            }}
          >
            Prev
          </p>
          <ul className="pagination-menu flex">
            {pageArr.map((page, i) => (
              <li
                key={i}
                onClick={() => {
                  this.props.updatePage(page);
                }}
                className={
                  activeIndex !== page
                    ? "pagination-menu-item"
                    : "pagination-menu-item active-page-menu-item"
                }
              >
                {page}
              </li>
            ))}
          </ul>
          <p
            onClick={() => {
              this.props.updatePage(
                activeIndex + 1 > noOfPages ? noOfPages : activeIndex + 1
              );
            }}
          >
            Next
          </p>
        </div>
      </section>
    );
  }
}

export default Pagination;