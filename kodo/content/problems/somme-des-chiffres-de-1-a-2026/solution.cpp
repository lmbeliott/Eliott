#include <iostream>
using namespace std;

int main() {
    int total = 0;
    for (int n = 1; n <= 2026; n++) {
        // Les quatre chiffres de n (ceux qui manquent valent 0).
        int unites = n % 10;
        int dizaines = n / 10 % 10;
        int centaines = n / 100 % 10;
        int milliers = n / 1000;
        total = total + unites + dizaines + centaines + milliers;
    }
    cout << total << "\n";
    return 0;
}
