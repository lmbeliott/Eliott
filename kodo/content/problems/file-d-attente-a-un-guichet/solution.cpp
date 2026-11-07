#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    long long libre = 0;      // instant où le guichet sera libre
    long long attente = 0;
    for (int i = 0; i < n; i++) {
        long long t, d;
        cin >> t >> d;
        long long debut;
        if (libre <= t) {
            debut = t;        // le guichet est libre : servi tout de suite
        } else {
            debut = libre;    // il attend la fin du client précédent
        }
        attente = attente + (debut - t);
        libre = debut + d;
    }
    cout << attente << " " << libre << "\n";
    return 0;
}
