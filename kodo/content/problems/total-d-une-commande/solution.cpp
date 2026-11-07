#include <iostream>
#include <string>
#include <map>
using namespace std;

int main() {
    int n;
    cin >> n;
    map<string, long long> prix;
    for (int i = 0; i < n; i++) {
        string nom;
        long long p;
        cin >> nom >> p;
        prix[nom] = p;          // un nouveau prix remplace l'ancien
    }

    int m;
    cin >> m;
    long long total = 0;
    int inconnus = 0;
    for (int i = 0; i < m; i++) {
        string nom;
        long long q;
        cin >> nom >> q;
        if (prix.count(nom) > 0) {      // ne pas écrire prix[nom] avant de tester
            total = total + prix[nom] * q;
        } else {
            inconnus = inconnus + 1;
        }
    }
    cout << total << "\n" << inconnus << "\n";
    return 0;
}
