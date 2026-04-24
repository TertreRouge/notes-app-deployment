import './Notes.css';
import { notes } from './PopUp';

export default function Notes({ toggleSlide }) {

    return (
        <main className='scrollView'>
            {
                notes.map((item) => (
                    <>
                        <article className='slideContainer' key={item._id}>
                            <div className='slide' onClick={() => toggleSlide(item)}>
                                <h4 className='noteHead'>{item.title}</h4>
                                <p className='noteCaption'>{item.details}</p>
                            </div>
                        </article>
                    </>
                )
                )
            }
        </main>
    )
}
