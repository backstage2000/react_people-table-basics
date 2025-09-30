import { useEffect, useState } from 'react';
import { Loader } from './Loader';

import { getPeople } from '../api';
import { Person } from '../types';
import { Link, useParams } from 'react-router-dom';
import cn from 'classnames';

export const PeopTable = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const { slug } = useParams();

  function getSlug(name: string, born: number): string {
    return `${name.toLowerCase().replace(/\s+/g, '-')}-${born}`;
  }

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);

    const fetchPeople = async () => {
      try {
        const result = await getPeople();

        setPeople(result);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setIsError(true);
        throw error;
      }
    };

    fetchPeople();
  }, []);

  return (
    <div className="box table-container">
      {isLoading && <Loader />}

      {!isLoading && !isError && people.length > 0 && (
        <table
          data-cy="peopleTable"
          className="table is-striped is-hoverable is-narrow is-fullwidth"
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Sex</th>
              <th>Born</th>
              <th>Died</th>
              <th>Mother</th>
              <th>Father</th>
            </tr>
          </thead>

          <tbody>
            {people?.map(person => {
              const mother = people.find(p => p.name === person.motherName);
              const motherSlug = mother
                ? getSlug(mother.name, mother.born)
                : null;

              const father = people.find(p => p.name === person.fatherName);
              const fatherSlug = father
                ? getSlug(father.name, father.born)
                : null;

              return (
                <tr
                  className={cn('', {
                    'has-background-warning': slug === person.slug,
                  })}
                  key={person.slug}
                  data-cy="person"
                >
                  <td>
                    <Link
                      className={cn('', {
                        'has-text-danger': person.sex === 'f',
                      })}
                      to={`/people/${person.slug}`}
                    >
                      {person.name}
                    </Link>
                  </td>

                  <td>{person.sex}</td>
                  <td>{person.born}</td>
                  <td>{person.died}</td>
                  <td>
                    {motherSlug ? (
                      <Link
                        className="has-text-danger"
                        to={`/people/${motherSlug}`}
                      >
                        {person.motherName}
                      </Link>
                    ) : (
                      person.motherName || '-'
                    )}
                  </td>
                  <td>
                    {motherSlug ? (
                      <Link to={`/people/${fatherSlug}`}>
                        {person.fatherName}
                      </Link>
                    ) : (
                      person.fatherName || '-'
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {isError && (
        <p data-cy="peopleLoadingError" className="has-text-danger">
          Something went wrong
        </p>
      )}
      {!isLoading && !isError && !people.length && (
        <p data-cy="noPeopleMessage">There are no people on the server</p>
      )}
    </div>
  );
};
