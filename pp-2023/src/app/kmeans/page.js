import CustomElementsDefaultInput from './client-elements-default-input';
import ClientElementsCustomizedInput from './client-elements-customized-input';
import 'server-only';

export default function SiteKMeans() {

    const gridRow = 'row';
    const gridColumn = 'col-12 col-md-6';

    return (
        <div className="container">
            <div className={gridRow}>
                <div className={gridColumn}>
                    <CustomElementsDefaultInput/>
                </div>
                <div className={gridColumn}>
                    <ClientElementsCustomizedInput/>
                </div>
            </div>
        </div>
    );
};