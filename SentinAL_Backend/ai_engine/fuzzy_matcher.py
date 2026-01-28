from thefuzz import fuzz
from api.models import Contract

def identify_asset(scraped_title):
    """
    Compares the scraped title against all Contracts in the DB.
    Returns the matching Contract object if confidence > 85.
    """
    all_contracts = Contract.objects.all()
    best_match = None
    highest_ratio = 0

    print(f"[*] Fuzzy Matching for: '{scraped_title}'")

    for contract in all_contracts:
        # Calculate similarity ratio
        ratio = fuzz.partial_ratio(scraped_title.lower(), contract.title.lower())
        
        if ratio > highest_ratio:
            highest_ratio = ratio
            best_match = contract

    # THRESHOLD: 85% confidence required
    if highest_ratio >= 85:
        print(f"   [+] MATCH FOUND: {best_match.title} (Score: {highest_ratio})")
        return best_match
    
    print(f"   [-] No match found (Highest Score: {highest_ratio})")
    return None