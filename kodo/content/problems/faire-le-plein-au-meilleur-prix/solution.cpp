#include <iostream>
#include <vector>
#include <deque>
#include <utility>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    long long longueur, capacite;
    cin >> n >> longueur >> capacite;
    vector<long long> positions(n + 1), prix(n);
    for (int i = 0; i < n; i++) cin >> positions[i] >> prix[i];
    positions[n] = longueur;            // l'arrivée, comme une dernière étape

    // le réservoir : des lots (prix, litres), du moins cher (devant) au plus cher.
    // On ne paie un litre qu'au moment où on le consomme : un litre jamais
    // consommé n'a jamais vraiment été acheté.
    deque<pair<long long, long long>> reservoir;
    long long dans_le_reservoir = 0, cout_total = 0;
    for (int i = 0; i < n; i++) {
        // ici, on revend (on « n'achète pas ») le carburant plus cher que celui de la station
        while (!reservoir.empty() && reservoir.back().first > prix[i]) {
            dans_le_reservoir -= reservoir.back().second;
            reservoir.pop_back();
        }
        // puis on fait le plein au prix de la station
        if (dans_le_reservoir < capacite) {
            reservoir.push_back({prix[i], capacite - dans_le_reservoir});
            dans_le_reservoir = capacite;
        }
        // on roule jusqu'à l'étape suivante en brûlant d'abord le moins cher
        long long distance = positions[i + 1] - positions[i];
        if (distance > capacite) {
            cout << -1 << "\n";
            return 0;
        }
        dans_le_reservoir -= distance;
        while (distance > 0) {
            long long pris = min(distance, reservoir.front().second);
            cout_total += pris * reservoir.front().first;
            reservoir.front().second -= pris;
            distance -= pris;
            if (reservoir.front().second == 0) reservoir.pop_front();
        }
    }
    cout << cout_total << "\n";
    return 0;
}
