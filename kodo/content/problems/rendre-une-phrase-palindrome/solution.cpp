#include <cctype>
#include <iostream>
#include <string>
using namespace std;

int main() {
    string phrase;
    getline(cin, phrase);

    // les lettres seules, en minuscules
    string t = "";
    for (char c : phrase) {
        if (isalpha(c)) {
            t += (char) tolower(c);
        }
    }

    int remplacements = 0;
    int i = 0;
    int j = (int) t.size() - 1;
    while (i < j) {
        if (t[i] != t[j]) {
            remplacements = remplacements + 1;   // un remplacement par paire différente
        }
        i = i + 1;
        j = j - 1;
    }
    cout << remplacements << "\n";
    return 0;
}
