function UserAccordionPlaceholder() {
    return (
        <div className="accordion-item">
            <h2 className="accordion-header d-flex justify-content-between align-items-center px-3 py-2">
                {/* Placeholder for the main accordion button content */}
                <div className="flex-grow-1 pe-2">
                    <div className="mb-2 placeholder-glow">
                        <span className="placeholder col-10"></span>
                    </div>
                    <div className="mb-2 placeholder-glow">
                        <span className="placeholder col-8"></span>
                    </div>
                    <div className="placeholder-glow">
                        <span className="placeholder col-9"></span>
                    </div>
                </div>

                {/* Placeholder for the action buttons */}
                <div className="ms-2 placeholder-glow d-flex flex-column" aria-hidden="true">
                    <span className="placeholder placeholder-sm mb-1" style={{width: '75px', height: '20px'}}></span>
                    <span className="placeholder placeholder-sm" style={{width: '75px', height: '20px'}}></span>
                </div>
            </h2>
        </div>
    );
}

export default function UserAccordionsPlaceholder() {
    return (
        <div className="card text-center d-flex flex-column" style={{ height: '100%' }}>
            <div className="card-header sticky-top bg-primary text-light">List Of Users</div>
            <div className="card-body custom-scrollbar" style={{ overflowY: 'auto' }}>
                <div className="accordion">
                    {[...Array(5)].map((_, idx) => (
                        <div className="row mb-2" key={idx}>
                            <small className="col-1 d-flex align-items-center justify-content-center">{idx + 1}</small>
                            <div className="col">
                                <UserAccordionPlaceholder />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}