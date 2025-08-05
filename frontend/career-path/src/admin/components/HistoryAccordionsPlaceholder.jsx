function HistoryAccordionPlaceholder() {
    return (
        <div className="accordion-item mb-3">
            <h2 className="accordion-header d-flex justify-content-between align-items-center px-3 py-2">
                {/* Placeholder for the delete button */}
                <div className="placeholder-glow" aria-hidden="true">
                    <span className="placeholder placeholder-sm" style={{width: '70px', height: '30px'}}></span>
                </div>
                {/* Placeholder for the main accordion button */}
                <div className="ms-3 flex-grow-1 placeholder-glow">
                    <span className="placeholder col-12" style={{height: '30px'}}></span>
                </div>
            </h2>
        </div>
    );
}

export default function HistoryAccordionsPlaceholder() {
    return (
        <div className="card text-center">
            <div className="card-body">
                <div className="accordion">
                    {[...Array(3)].map((_, idx) => (
                        <HistoryAccordionPlaceholder key={idx} />
                    ))}
                </div>
            </div>
        </div>
    );
}