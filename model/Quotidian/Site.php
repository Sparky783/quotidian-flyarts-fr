<?php
namespace Quotidian;
use DateTime;
use DateInterval;
use System\Database;

// ===================================================================================
// ==== Représente un site internet. Utilisé pour l'affichage quotidien des sites ====
// ===================================================================================

/**
 * Represent a website.
 */
class Site
{
	// == ATTRIBUTS ==
	/**
	 * @var int|null $_id 
	 */
	private ?int $_id = null;
	
	/**
	 * @var int|null $_idUser 
	 */
	private ?int $_idUser = null;
	
	/**
	 * @var string $_name 
	 */
    private string $_name = '';
	
	/**
	 * @var string $_url 
	 */
    private string $_url = '';
	
	/**
	 * @var string $_frequency 
	 */
	private string $_frequency = '';
	
	/**
	 * @var DateTime|null $_nextDate 
	 */
	private ?DateTime $_nextDate = null;
	
	/**
	 * @var DateTime|null $_lastVisit 
	 */
	private ?DateTime $_lastVisit = null;
	
	/**
	 * @var bool $_toVisit 
	 */
	private bool $_toVisit = false;
   
    // == METHODES PRIMAIRES ==
    public function __construct(array $dbData = [])
    {
        if (count($dbData) > 0) {
			$this->_id = (int)$dbData['id_site'];
			$this->_idUser = (int)$dbData['id_user'];
            $this->_name = $dbData['name'];
            $this->_url = $dbData['url'];
			$this->_frequency = $dbData['frequency'];
			$this->_nextDate = new DateTime($dbData['next_date']);
			$this->_lastVisit = new DateTime($dbData['last_visit']);
        }
    }

	// == METHODES GETTERS ==
	/**
	 * Return the website's ID.
	 * 
	 * @return int|null
	 */
    public function getId(): int|null
    {
        return $this->_id;
	}
	
	/**
	 * Return the user ID associated to the website.
	 * 
	 * @return int|null
	 */
	public function getIdUser(): int|null
    {
        return $this->_idUser;
    }

	/**
	 * Return the website's name.
	 * 
	 * @return string
	 */
    public function getName(): string 
    {
        return $this->_name;
    }

	/**
	 * Return the website's URL.
	 * 
	 * @return string
	 */
    public function getUrl(): string
    {
        return $this->_url;
    }
	
	/**
	 * Return the website's frequency.
	 * 
	 * @return string
	 */
    public function getFrequency(): string
    {
        return $this->_frequency;
    }

	/**
	 * Return the next date when the website must be visited.
	 * 
	 * @return DateTime|null
	 */
    public function getNextDate(): DateTime|null
    {
        return $this->_nextDate;
	}
	
	/**
	 * Return the last date when the website was visited.
	 * 
	 * @return DateTime|null
	 */
	public function getLastVisit(): DateTime|null
    {
        return $this->_lastVisit;
    }
	
	/**
	 * Return True if the website was visited, else False.
	 * 
	 * @return bool
	 */
	public function getToVisit(): bool
    {
        return $this->_toVisit;
	}
	
	// == METHODES SETTERS ==
	/**
	 * Define the website's ID.
	 * 
	 * @param int $idUser
	 * @return void
	 */
	public function setIdUser(int $idUser): void
	{
		$this->_idUser = $idUser;
	}

	/**
	 * Define the website's name.
	 * 
	 * @param string $name
	 * @return void
	 */
	public function setName(string $name): void
	{
		$this->_name = $name;
	}

	/**
	 * Define the website's URL.
	 * 
	 * @param string $url
	 * @return void
	 */
	public function setUrl(string $url): void
	{
		$this->_url = $url;
	}

	/**
	 * Define the website's frequency.
	 * 
	 * @param string $frequency
	 * @return bool
	 */
	public function setFrequency(string $frequency): bool
	{
		$enum = [
			'daily',
			'weekly',
			'monthly',
			'yearly'
		];

		if (in_array($frequency, $enum)) {
			$this->_frequency = $frequency;

			return true;
		}

		return false;
	}

	/**
	 * Define the next date when the website must be visited.
	 * 
	 * @param DateTime $nextDate
	 * @return void
	 */
	public function setNextDate(DateTime $nextDate): void
	{
		$this->_nextDate = $nextDate;
	}

	/**
	 * Define the last date when the website was visited.
	 * 
	 * @param DateTime $lastVisit
	 * @return void
	 */
	public function setLastVisit($lastVisit): void
	{
		$this->_lastVisit = $lastVisit;
	}

	/**
	 * Define if the website was visited.
	 * 
	 * @param DateTime $toVisit
	 * @return void
	 */
	public function setToVisit($toVisit): void
	{
		$this->_toVisit = $toVisit;
	}

	// == AUTRES METHODES ==
	/**
	 * Save the website into database
	 * 
	 * @return bool Return True if the save was succesful, else False
	 */
	public function saveToDatabase(): bool
	{
		$database = new Database();

		if ($this->_id === null) { // Insert
			$id = $database->insert(
				'sites',
				[
					'id_user' => $this->_idUser,
					'name' => $this->_name,
					'url' => $this->_url,
					'frequency' => $this->_frequency,
					'next_date' => $this->_nextDate->format('Y-m-d'),
					'last_visit' => $this->_lastVisit->format('Y-m-d')
				]
			);

			if ($id !== false) {
				$this->_id = (int)$id;
				return true;
			}
			
			return false;
		}

		// Update
		$result = $database->update(
			'sites', 'id_site', $this->_id,
			[
				'id_user' => $this->_idUser,
				'name' => $this->_name,
				'url' => $this->_url,
				'frequency' => $this->_frequency,
				'next_date' => $this->_nextDate->format('Y-m-d'),
				'last_visit' => $this->_lastVisit->format('Y-m-d')
			]
		);

		return $result;
	}

	/**
	 * Return an associative array of the website.
	 * 
	 * @return array
	 */
	public function toArray(): array
	{
		return [
			'id' => $this->_id,
			'id_user' => $this->_idUser,
			'name' => $this->_name,
			'url' => $this->_url,
			'frequency' => $this->_frequency,
			'next_date' => $this->_nextDate->format('Y-m-d'),
			'to_visit' => $this->_toVisit,
			'last_visit' => $this->_lastVisit->format('d/m/Y')
		];
	}

	/**
	 * Search the next date to visit the website.
	 */
	public function searchNextDate(): void
	{
		$today = new DateTime();
		$date = $this->getNextDate();

		while ($date < $today) {
			switch($this->getFrequency()) {
				case 'daily':
					$date->add(new DateInterval('P1D'));
					break;
					
				case 'weekly':
					$date->add(new DateInterval('P1W'));
					break;
					
				case 'monthly':
					$date->add(new DateInterval('P1M'));
					break;
					
				default: // Annuel et autre
					$date->add(new DateInterval('P1Y'));
					break;
			}
		}
		
		$this->setNextDate($date);
	}

	// ==============================================================================
	// ==== Fonctions statiques =====================================================
	// ==============================================================================
	/**
	 * Return the website by its ID.
	 * 
	 * @param int $idSite ID of the website to get.
	 * @return Site|false Return False if the website does not exist.
	 */
	public static function getById(int $idSite): Site|false
	{
		$database = new Database();

		$rech = $database->query(
			"SELECT * FROM sites WHERE id_site=:id_site",
			['id_site' => (int)$idSite]
		);

		if ($rech !== null) {
			$data = $rech->fetch();

			return new Site($data);
		}
		
		return false;
	}

	/**
	 * Return the list of websites for an user.
	 * 
	 * @param int $idUser ID of the user website to get.
	 * @return array|false Return False if an error occured
	 */
	public static function getList(int $idUser): array|false
	{
		$database = new Database();

		$sites = $database->query(
			"SELECT * FROM sites WHERE id_user=:id_user",
			['id_user' => (int)$idUser]
		);

		if ($sites !== null) {
			$list = [];

			while ($data = $sites->fetch()) {
				$list[] = new Site($data);
			}

			return $list;
		}
		
		return false;
	}

	/**
	 * Remove a website from database.
	 * 
	 * @param int $idSite ID of the website to remove.
	 * @return bool Return True if the website was removed else False.
	 */
	public static function removeFromDatabase(int $idSite): bool
	{
		$database = new Database();

		return $database->delete('sites', 'id_site', $idSite);
	}
}
?>