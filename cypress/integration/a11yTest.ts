
const terminalLog = (violations) => {
    cy.task(
        'log',
        `${violations.length} accessibility violation${violations.length === 1 ? '' : 's'
        } ${violations.length === 1 ? 'was' : 'were'} detected`
    )

    const violationData = violations.map(
        ({ id, impact, description, nodes }) => ({
            id,
            impact,
            description,
            nodes: nodes.length
        })
    )

    cy.task('table', violationData)
}


describe("Page accessibility tests", () => {
    beforeEach(() => {
        cy.visit("/");
        cy.injectAxe();
    });

    it('Should have no accessibility violations', () => {

        cy.checkA11y(
            {
                exclude: ['.theme-registry-editor']
            },
            null, terminalLog
        );
    })

});

